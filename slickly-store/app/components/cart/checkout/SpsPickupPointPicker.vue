<script setup lang="ts">
import { MapPin, Pencil } from 'lucide-vue-next';
import type { PickupPoint, ShippingAddressForm } from '~/composables/useCheckoutFlow';

const props = defineProps<{
    modelValue: PickupPoint | null;
    shippingAddress: ShippingAddressForm;
    countries: { value: string; label: string; iso: string }[];
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', val: PickupPoint | null): void;
}>();

const SPS_WIDGET_SCRIPT_URL = 'https://balikomat.sps-sro.sk/widget/v1/widget/js/widget.js';
const SPS_WIDGET_SCRIPT_ID = 'sps-widget-script';

const isWidgetReady = ref(false);

const ensureWidgetLoaded = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if ((window as any).SPSwidget?.showMap) {
            resolve();
            return;
        }

        const existing = document.getElementById(SPS_WIDGET_SCRIPT_ID) as HTMLScriptElement | null;
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error('SPS widget script failed to load')));
            return;
        }

        const script = document.createElement('script');
        script.id = SPS_WIDGET_SCRIPT_ID;
        script.src = SPS_WIDGET_SCRIPT_URL;
        script.async = true;
        script.addEventListener('load', () => resolve());
        script.addEventListener('error', () => reject(new Error('SPS widget script failed to load')));
        document.head.appendChild(script);
    });
};

const countryIso = computed(() => {
    const country = props.countries.find((c) => c.value === props.shippingAddress.countryId);
    return country?.iso || 'SK';
});

const addressQuery = computed(() => {
    const { street, zipcode, city } = props.shippingAddress;
    return [street, [zipcode, city].filter(Boolean).join(' ')].filter(Boolean).join(', ');
});

const openWidget = async () => {
    try {
        await ensureWidgetLoaded();
    } catch (e) {
        console.error('[SpsPickupPointPicker] widget load error:', e);
        return;
    }

    isWidgetReady.value = true;

    const widget = (window as any).SPSwidget;
    widget.config = widget.config || {};
    widget.config.widget_url = 'https://balikomat.sps-sro.sk';
    widget.config.button = 'sps-parcelshop-wrapper-button';
    widget.config.custom_button_click = true;
    widget.config.nodisplay_on_init = true;
    widget.config.clean_on_close = true;
    widget.config.callback = 'MtsportSpsWidget.onSelect';
    widget.config.type = null;
    widget.config.country = countryIso.value;
    widget.config.address = addressQuery.value;

    widget.showMap();
};

onMounted(() => {
    (window as any).MtsportSpsWidget = {
        onSelect: (place: any) => {
            const pickupPoint: PickupPoint = {
                id: place.id,
                description: place.description,
                address: place.address,
                zip: place.zip,
                city: place.city,
                countryISO: place.countryISO,
                cod: place.cod,
                type: place.type,
            };
            emit('update:modelValue', pickupPoint);
        },
    };
});
</script>

<template>
    <div class="space-y-2">
        <button
            id="sps-parcelshop-wrapper-button"
            type="button"
            @click="openWidget"
            class="flex items-center gap-2 px-4 py-2.5 border-2 border-black text-black font-black uppercase tracking-wide text-xs font-tech hover:bg-black hover:text-white transition-colors duration-200"
        >
            <MapPin class="w-4 h-4" />
            <template v-if="modelValue">Zmeniť výdajné miesto</template>
            <template v-else>Vybrať výdajné miesto</template>
        </button>

        <div v-if="modelValue" class="border-2 border-brand/30 bg-brand/5 p-3 flex items-start gap-3">
            <MapPin class="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
            <div class="text-sm font-sans text-gray-700 leading-snug min-w-0">
                <div class="font-bold truncate">{{ modelValue.description }}</div>
                <div>{{ modelValue.address }}</div>
                <div>{{ modelValue.zip }} {{ modelValue.city }}, {{ modelValue.countryISO }}</div>
            </div>
            <button
                type="button"
                @click="openWidget"
                class="ml-auto flex-shrink-0 text-gray-400 hover:text-brand transition-colors"
                aria-label="Zmeniť výdajné miesto"
            >
                <Pencil class="w-4 h-4" />
            </button>
        </div>

        <p v-else class="text-[11px] text-brand font-bold font-sans">
            Vyberte výdajné miesto pre dokončenie objednávky.
        </p>
    </div>
</template>
