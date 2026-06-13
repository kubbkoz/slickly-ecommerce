<script setup lang="ts">
const route = useRoute()
const search = useSearchStore()

const links = [
  { label: 'Home', icon: 'home', to: '/' },
  { label: 'Search', icon: 'search', to: '/produkty' },
  { label: 'Offers', icon: 'local_offer', to: '/produkty?akcia=1' },
  { label: 'Account', icon: 'person', to: '/ucet' },
]

function isActive(to: string) {
  const path = to.split('?')[0]
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}
</script>

<template>
  <nav class="md:hidden fixed bottom-0 w-full z-50 h-16 bg-surface border-t border-outline-variant flex justify-around items-center">
    <template v-for="link in links" :key="link.label">
      <button
        v-if="link.label === 'Search'"
        type="button"
        aria-label="Hľadať"
        class="flex flex-col items-center justify-center transition-transform duration-200 active:scale-90 cursor-pointer text-on-surface-variant hover:text-primary"
        @click="search.open()"
      >
        <span class="material-symbols-outlined" aria-hidden="true">{{ link.icon }}</span>
        <span class="font-badge-label text-badge-label">{{ link.label }}</span>
      </button>
      <NuxtLink
        v-else
        :to="link.to"
        class="flex flex-col items-center justify-center transition-transform duration-200 active:scale-90"
        :class="isActive(link.to) ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'"
      >
        <span class="material-symbols-outlined" :style="isActive(link.to) ? { fontVariationSettings: &quot;'FILL' 1&quot; } : {}">{{ link.icon }}</span>
        <span class="font-badge-label text-badge-label">{{ link.label }}</span>
      </NuxtLink>
    </template>
  </nav>
</template>
