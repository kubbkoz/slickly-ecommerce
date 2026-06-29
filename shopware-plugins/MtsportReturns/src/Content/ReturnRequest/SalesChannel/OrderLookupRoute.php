<?php declare(strict_types=1);

namespace Mtsport\Returns\Content\ReturnRequest\SalesChannel;

use Shopware\Core\Checkout\Order\OrderEntity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Store API endpoint pre vyhľadanie objednávky podľa orderNumber + email.
 *
 * Endpoint: POST /store-api/mtsport-return/lookup-order
 * Auth: public sw-access-key
 *
 * Request body:
 *   { orderNumber: string, email: string }
 *
 * Response:
 *   {
 *     found: bool,
 *     within14Days: bool,
 *     order?: {
 *       orderNumber, orderDate, customerName, customerEmail,
 *       items: [{ name, qty }],
 *     }
 *   }
 */
#[Route(defaults: ['_routeScope' => ['store-api']])]
class OrderLookupRoute
{
    public function __construct(
        private readonly EntityRepository $orderRepository,
    ) {
    }

    #[Route(
        path: '/store-api/mtsport-return/lookup-order',
        name: 'store-api.mtsport_return.lookup_order',
        methods: ['POST'],
    )]
    public function lookup(Request $request, SalesChannelContext $context): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $orderNumber = trim((string)($data['orderNumber'] ?? ''));
        $email       = strtolower(trim((string)($data['email'] ?? '')));

        if (!$orderNumber || !$email) {
            return new JsonResponse(['found' => false, 'error' => 'orderNumber and email required'], 400);
        }

        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('orderNumber', $orderNumber));
        $criteria->addAssociation('orderCustomer');
        $criteria->addAssociation('lineItems');
        $criteria->addAssociation('addresses.country');
        $criteria->addAssociation('billingAddress.country');
        $criteria->addAssociation('deliveries.shippingOrderAddress.country');
        $criteria->setLimit(1);

        $result = $this->orderRepository->search($criteria, $context->getContext());
        /** @var OrderEntity|null $order */
        $order = $result->first();

        if (!$order) {
            return new JsonResponse(['found' => false]);
        }

        $customer = $order->getOrderCustomer();
        if (!$customer || strtolower((string)$customer->getEmail()) !== $email) {
            return new JsonResponse(['found' => false, 'reason' => 'email_mismatch']);
        }

        $orderDate = $order->getOrderDate();
        $daysSince = $orderDate ? (int)((new \DateTime())->diff($orderDate)->days) : 0;
        $within14  = $orderDate ? ($daysSince <= 14) : false;

        $items = [];
        $lineItems = $order->getLineItems();
        if ($lineItems) {
            foreach ($lineItems as $li) {
                $items[] = [
                    'name' => $li->getLabel(),
                    'qty'  => $li->getQuantity(),
                ];
            }
        }

        // ── Billing address (preferred) + fallback na shipping ────────────
        $billingAddrId = method_exists($order, 'getBillingAddressId') ? $order->getBillingAddressId() : null;
        $billingAddr = null;
        $shippingAddr = null;
        $phone = null;

        $addresses = $order->getAddresses();
        if ($addresses) {
            foreach ($addresses as $addr) {
                if ($billingAddrId && $addr->getId() === $billingAddrId) {
                    $billingAddr = $addr;
                    break;
                }
            }
            if (!$billingAddr) {
                $billingAddr = $addresses->first();
            }
        }

        $deliveries = $order->getDeliveries();
        if ($deliveries && $deliveries->first()) {
            $shippingAddr = $deliveries->first()->getShippingOrderAddress();
        }

        // Phone: billing → shipping → orderCustomer
        if ($billingAddr && method_exists($billingAddr, 'getPhoneNumber')) {
            $phone = $billingAddr->getPhoneNumber();
        }
        if (!$phone && $shippingAddr && method_exists($shippingAddr, 'getPhoneNumber')) {
            $phone = $shippingAddr->getPhoneNumber();
        }

        $billingArr = null;
        if ($billingAddr) {
            $country = method_exists($billingAddr, 'getCountry') ? $billingAddr->getCountry() : null;
            $billingArr = [
                'firstName' => method_exists($billingAddr, 'getFirstName') ? $billingAddr->getFirstName() : null,
                'lastName'  => method_exists($billingAddr, 'getLastName') ? $billingAddr->getLastName() : null,
                'street'    => method_exists($billingAddr, 'getStreet') ? $billingAddr->getStreet() : null,
                'zipcode'   => method_exists($billingAddr, 'getZipcode') ? $billingAddr->getZipcode() : null,
                'city'      => method_exists($billingAddr, 'getCity') ? $billingAddr->getCity() : null,
                'country'   => $country ? ($country->getTranslation('name') ?? $country->getName()) : null,
                'phone'     => method_exists($billingAddr, 'getPhoneNumber') ? $billingAddr->getPhoneNumber() : null,
            ];
        }

        return new JsonResponse([
            'found'          => true,
            'within14Days'   => $within14,
            'daysSinceOrder' => $daysSince,
            'order'          => [
                'orderNumber'    => $order->getOrderNumber(),
                'orderDate'      => $orderDate?->format('Y-m-d'),
                'customerName'   => trim(($customer->getFirstName() ?? '') . ' ' . ($customer->getLastName() ?? '')),
                'customerEmail'  => $customer->getEmail(),
                'customerPhone'  => $phone,
                'billingAddress' => $billingArr,
                'items'          => $items,
            ],
        ]);
    }
}
