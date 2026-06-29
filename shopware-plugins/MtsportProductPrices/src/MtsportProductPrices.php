<?php declare(strict_types=1);

namespace Mtsport\ProductPrices;

use Mtsport\ProductPrices\Installer\CustomFieldInstaller;
use Shopware\Core\Framework\Plugin;
use Shopware\Core\Framework\Plugin\Context\InstallContext;
use Shopware\Core\Framework\Plugin\Context\UninstallContext;
use Shopware\Core\Framework\Plugin\Context\UpdateContext;

class MtsportProductPrices extends Plugin
{
    public function install(InstallContext $context): void
    {
        (new CustomFieldInstaller($this->container))->install($context->getContext());
    }

    public function update(UpdateContext $context): void
    {
        (new CustomFieldInstaller($this->container))->install($context->getContext());
    }

    public function uninstall(UninstallContext $context): void
    {
        if ($context->keepUserData()) {
            return;
        }
        (new CustomFieldInstaller($this->container))->uninstall($context->getContext());
    }
}
