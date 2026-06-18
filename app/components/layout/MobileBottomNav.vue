<script setup lang="ts">
const route = useRoute()
const wishlist = useWishlistStore()
const hydrated = ref(false)
onMounted(() => { nextTick(() => { hydrated.value = true }) })

const links = [
  { label: 'Domov', icon: 'home', to: '/' },
  { label: 'Obľúbené', icon: 'favorite', to: '/oblubene' },
  { label: 'Akcie', icon: 'local_offer', to: '/produkty?akcia=1' },
  { label: 'Účet', icon: 'person', to: '/ucet' },
]

function isActive(to: string) {
  const [path, queryString] = to.split('?')
  if (path === '/') return route.path === '/'
  if (queryString) {
    const params = new URLSearchParams(queryString)
    for (const [key, value] of params) {
      if (route.query[key] !== value) return false
    }
    return route.path === path
  }
  return route.path.startsWith(path!)
}

function haptic() {
  if ('vibrate' in navigator) navigator.vibrate(8)
}
</script>

<template>
  <nav
    aria-label="Spodná navigácia"
    class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/[.97] backdrop-blur-sm border-t border-outline-variant/50 flex justify-around items-end safe-bottom"
    style="padding-bottom: max(env(safe-area-inset-bottom, 0px), 4px)"
  >
    <NuxtLink
      v-for="link in links"
      :key="link.label"
      v-slot="{ href, navigate }"
      :to="link.to"
      custom
    >
      <a
        :href="href"
        :aria-current="isActive(link.to) ? 'page' : undefined"
        class="relative flex flex-col items-center justify-center min-w-14 min-h-14 px-2 pt-2 pb-1 rounded-xl transition-[color,transform] duration-200 active:scale-90 [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :class="isActive(link.to) ? 'text-primary' : 'text-on-surface-variant'"
        @click="haptic(); navigate($event)"
      >
        <span
          class="w-8 h-8 flex items-center justify-center rounded-full transition-[background-color] duration-200"
          :class="isActive(link.to) ? 'bg-secondary-container/30' : ''"
        >
          <span
            class="material-symbols-outlined text-[22px]"
            :style="isActive(link.to) ? { fontVariationSettings: &quot;'FILL' 1&quot; } : {}"
            aria-hidden="true"
          >{{ link.icon }}</span>
        </span>
        <span
          v-if="link.label === 'Obľúbené' && wishlist.count > 0"
          :key="wishlist.count"
          class="absolute top-1 right-1/4 bg-error text-on-error text-[9px] font-bold leading-none rounded-full min-w-[16px] h-4 flex items-center justify-center px-1"
          :class="hydrated ? 'badge-pop' : ''"
        >
          {{ wishlist.count }}
        </span>
        <span
          class="font-badge-label text-[10px] mt-0.5 transition-colors duration-200"
          :class="isActive(link.to) ? 'text-primary font-bold' : ''"
        >{{ link.label }}</span>
      </a>
    </NuxtLink>
  </nav>
</template>
