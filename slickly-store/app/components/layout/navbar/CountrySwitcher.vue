<script setup lang="ts">
import { ChevronDown, Check, Globe } from 'lucide-vue-next';
import { onClickOutside } from '@vueuse/core';

const props = defineProps<{
  /** 'dark' = TopBar čierny bg (biely text) | 'light' = MobileMenu šedý bg (tmavý text) */
  variant?: 'dark' | 'light';
}>();

const {
  availableCountries,
  selectedCountryId,
  selectedCountryDisplay,
  selectCountry,
} = useCountrySelector();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
onClickOutside(containerRef, () => { isOpen.value = false; });

const handleSelect = (country: any) => {
  isOpen.value = false;
  selectCountry(country);
};
</script>

<template>
  <div class="relative" ref="containerRef">

    <!-- ── Trigger button ── -->
    <button
      @click="isOpen = !isOpen"
      :class="[
        'flex items-center gap-1.5 cursor-pointer transition-colors',
        props.variant === 'light'
          ? 'bg-white py-2 px-3 border border-zinc-200 text-black text-xs font-bold hover:border-black'
          : 'bg-transparent border-none text-white/80 hover:text-white text-[10px] font-normal',
      ]"
      aria-label="Zmeniť krajinu doručenia"
    >
      <img
        :src="selectedCountryDisplay.flagUrl"
        :alt="selectedCountryDisplay.iso"
        class="w-5 h-3.5 rounded-[1px] object-cover flex-shrink-0"
      />
      <span class="uppercase tracking-wider">{{ selectedCountryDisplay.iso }}</span>
      <ChevronDown
        class="w-3 h-3 transition-transform duration-200"
        :class="isOpen ? 'rotate-180' : ''"
      />
    </button>

    <!-- ── Dropdown panel ── -->
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-[-6px]"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-[-6px]"
    >
      <div
        v-if="isOpen && availableCountries?.length"
        :class="[
          'absolute bg-white border border-gray-200 shadow-2xl z-[210] w-[230px]',
          props.variant === 'light'
            ? 'bottom-full right-0 mb-2'
            : 'top-full right-0 mt-2',
        ]"
      >
        <!-- Panel header -->
        <div class="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <Globe class="w-3.5 h-3.5 text-brand flex-shrink-0" />
          <span class="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 font-sans">
            Krajina doručenia
          </span>
        </div>

        <!-- Country list -->
        <div class="max-h-[260px] overflow-y-auto">
          <button
            v-for="country in availableCountries"
            :key="country.id"
            @click="handleSelect(country)"
            class="w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors duration-100 font-sans group"
            :class="
              country.id === selectedCountryId
                ? 'bg-gray-50 text-brand'
                : 'text-gray-800 hover:bg-black hover:text-white'
            "
          >
            <span class="flex items-center gap-3">
              <img
                :src="`https://flagcdn.com/w40/${country.iso.toLowerCase()}.png`"
                :alt="country.iso"
                class="w-5 h-3.5 rounded-[1px] object-cover flex-shrink-0"
              />
              <!-- Normal capitalization — nie uppercase -->
              <span class="text-[13px] font-normal leading-none">{{ country.name }}</span>
            </span>
            <Check
              v-if="country.id === selectedCountryId"
              class="w-3.5 h-3.5 text-brand flex-shrink-0 ml-2 group-hover:text-white"
            />
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>
