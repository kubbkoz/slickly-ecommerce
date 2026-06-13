<script setup lang="ts">
const route = useRoute()
const wishlist = useWishlistStore()

const links = [
  { label: 'Home', icon: 'home', to: '/' },
  { label: 'Obľúbené', icon: 'favorite', to: '/oblubene' },
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
    <NuxtLink
      v-for="link in links"
      :key="link.label"
      :to="link.to"
      class="relative flex flex-col items-center justify-center transition-transform duration-200 active:scale-90"
      :class="isActive(link.to) ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'"
    >
      <span class="material-symbols-outlined" :style="isActive(link.to) ? { fontVariationSettings: &quot;'FILL' 1&quot; } : {}" aria-hidden="true">{{ link.icon }}</span>
      <span
        v-if="link.label === 'Obľúbené' && wishlist.count > 0"
        class="absolute top-0 right-1/4 bg-secondary-container text-on-secondary-container text-[10px] font-bold leading-none rounded-full min-w-[16px] h-4 flex items-center justify-center px-1"
      >
        {{ wishlist.count }}
      </span>
      <span class="font-badge-label text-badge-label">{{ link.label }}</span>
    </NuxtLink>
  </nav>
</template>
