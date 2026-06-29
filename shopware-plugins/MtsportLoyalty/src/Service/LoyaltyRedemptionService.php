<?php declare(strict_types=1);

namespace Mtsport\Loyalty\Service;

use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\Uuid\Uuid;

class LoyaltyRedemptionService
{
    public function __construct(
        private readonly EntityRepository $rewardRepository,
        private readonly EntityRepository $redemptionRepository,
        private readonly EntityRepository $promotionRepository,
        private readonly EntityRepository $productRepository,
        private readonly LoyaltyPointsService $pointsService,
    ) {
    }

    /**
     * @return array{success:bool, code?:string, expiresAt?:string, pointsSpent?:int, error?:string}
     */
    public function redeem(string $customerId, string $rewardId, Context $context): array
    {
        // 1. Load reward
        $reward = $this->rewardRepository->search(new Criteria([$rewardId]), $context)->first();
        if (!$reward || !$reward->get('isActive')) {
            return ['success' => false, 'error' => 'Odmena nie je dostupná.'];
        }

        $pointsRequired = (int) $reward->get('pointsRequired');

        // 2. Check points
        $available = $this->pointsService->getCustomerPoints($customerId);
        if ($available < $pointsRequired) {
            return ['success' => false, 'error' => 'Nemáte dostatok bodov.'];
        }

        // 3. Check max uses per customer
        $maxUses = (int) ($reward->get('maxUsesPerCustomer') ?? 1);
        if ($maxUses > 0) {
            $usedCrit = new Criteria();
            $usedCrit->addFilter(new EqualsFilter('customerId', $customerId));
            $usedCrit->addFilter(new EqualsFilter('rewardId', $rewardId));
            $usedCount = $this->redemptionRepository->search($usedCrit, $context)->getTotal();
            if ($usedCount >= $maxUses) {
                return ['success' => false, 'error' => 'Túto odmenu ste už vyčerpali.'];
            }
        }

        // 4. Generate code
        $code = 'MT-' . strtoupper(substr(Uuid::randomHex(), 0, 8));
        $validDays = (int) ($reward->get('validDays') ?? 30);
        $expiresAt = (new \DateTime())->modify("+{$validDays} days");

        // 5. Create Shopware promotion
        try {
            $this->createPromotion($reward, $code, $expiresAt, $context);
        } catch (\Throwable $e) {
            return ['success' => false, 'error' => 'Nepodarilo sa vytvoriť kód: ' . $e->getMessage()];
        }

        // 6. Record redemption + spend points
        $this->redemptionRepository->create([[
            'id'            => Uuid::randomHex(),
            'customerId'    => $customerId,
            'rewardId'      => $rewardId,
            'rewardName'    => $reward->get('name'),
            'promotionCode' => $code,
            'pointsSpent'   => $pointsRequired,
            'status'        => 'active',
            'expiresAt'     => $expiresAt,
        ]], $context);

        $this->pointsService->addPoints(
            $customerId,
            -$pointsRequired,
            'redemption',
            $code,
            'Uplatnenie: ' . $reward->get('name'),
            $context
        );

        return [
            'success'     => true,
            'code'        => $code,
            'expiresAt'   => $expiresAt->format('Y-m-d'),
            'pointsSpent' => $pointsRequired,
        ];
    }

    private function createPromotion($reward, string $code, \DateTime $expiresAt, Context $context): void
    {
        $type = $reward->get('type');
        $value = (float) $reward->get('discountValue');
        $ruleId = $reward->get('ruleId');
        $promotionId = Uuid::randomHex();

        $discount = $this->buildDiscount($reward, $type, $value, $context);

        $promotion = [
            'id'                       => $promotionId,
            'name'                     => 'Vernostná odmena: ' . $reward->get('name'),
            'active'                   => true,
            'useCodes'                 => true,
            'useIndividualCodes'       => false,
            'code'                     => $code,
            'maxRedemptionsGlobal'     => 1,
            'maxRedemptionsPerCustomer'=> 1,
            'validUntil'               => $expiresAt->format(\DATE_ATOM),
            'discounts'                => [$discount],
        ];

        // Restrict promotion to a Shopware rule (category/brand/product)
        if ($ruleId) {
            $promotion['cartRules'] = [['id' => $ruleId]];
        }

        $this->promotionRepository->create([$promotion], $context);
    }

    private function buildDiscount($reward, string $type, float $value, Context $context): array
    {
        $base = [
            'id'                 => Uuid::randomHex(),
            'considerAdvancedRules' => false,
        ];

        return match ($type) {
            'percentage' => array_merge($base, [
                'scope' => 'cart', 'type' => 'percentage', 'value' => $value,
            ]),
            'fixed' => array_merge($base, [
                'scope' => 'cart', 'type' => 'absolute', 'value' => $value,
            ]),
            'free_shipping' => array_merge($base, [
                'scope' => 'delivery', 'type' => 'percentage', 'value' => 100,
            ]),
            'gift' => $this->buildGiftDiscount($reward, $base, $context),
            default => array_merge($base, [
                'scope' => 'cart', 'type' => 'percentage', 'value' => $value,
            ]),
        };
    }

    /**
     * Gift = absolute discount (productPrice − 0.01) on cart.
     * Customer adds the gift product, applies code, effectively pays 1 cent.
     * The reward should reference a rule restricting cart to contain the gift product.
     */
    private function buildGiftDiscount($reward, array $base, Context $context): array
    {
        $giftProductId = $reward->get('giftProductId');
        $price = 0.0;
        if ($giftProductId) {
            $product = $this->productRepository->search(new Criteria([$giftProductId]), $context)->first();
            if ($product && $product->get('price')) {
                $priceArr = $product->get('price');
                $first = is_array($priceArr) ? ($priceArr[0] ?? null) : ($priceArr->first() ?? null);
                if ($first) {
                    $price = (float) (is_array($first) ? ($first['gross'] ?? 0) : $first->getGross());
                }
            }
        }
        $discountValue = max(0, $price - 0.01);
        return array_merge($base, [
            'scope' => 'cart', 'type' => 'absolute', 'value' => $discountValue,
        ]);
    }
}
