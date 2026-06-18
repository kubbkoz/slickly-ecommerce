<script setup lang="ts">
const badges = [
  { icon: 'local_shipping', label: 'Doprava zdarma' },
  { icon: 'verified', label: 'Overené produkty' },
  { icon: 'workspace_premium', label: 'Garancia kvality' },
  { icon: 'support_agent', label: '24/7 podpora' },
]
</script>

<template>
  <section class="w-full bg-secondary-container">
    <!-- Mobile: static grid, no marquee animation -->
    <div class="md:hidden py-3 px-gutter">
      <div class="flex justify-between items-center">
        <div v-for="badge in badges" :key="badge.label" class="flex flex-col items-center gap-1 text-on-secondary-container">
          <span class="material-symbols-outlined text-[20px]" aria-hidden="true">{{ badge.icon }}</span>
          <span class="font-badge-label text-[9px] uppercase">{{ badge.label }}</span>
        </div>
      </div>
    </div>

    <!-- Desktop grid -->
    <div class="hidden md:block py-6 border-y border-on-secondary-container/10">
      <div class="max-w-[1536px] mx-auto px-grid-margin grid grid-cols-4 gap-6">
        <div v-for="badge in badges" :key="badge.label" class="flex items-center justify-center gap-3 text-on-secondary-container">
          <span class="material-symbols-outlined text-[24px]" aria-hidden="true">{{ badge.icon }}</span>
          <span class="font-label-sm text-label-sm uppercase tracking-wider font-bold">{{ badge.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
