<script setup lang="ts">
const cart = useCartStore()
const wishlist = useWishlistStore()
const locale = useLocaleStore()
const search = useSearchStore()

const hasOverlay = computed(() => cart.isDrawerOpen || search.isOpen)

const site = useSiteUrl()

// Site-wide entity + search-box structured data. Rendered once for every
// route via the default layout.
useJsonLd([
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SLICKLY',
    url: site,
    logo: `${site}/favicon.ico`,
    description:
      'Prémiový marketplace pre starostlivosť o auto. Kurátorský výber keramickej ochrany, detailingu a autokozmetiky od najlepších svetových značiek.',
    slogan: 'Umenie Čistoty',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SLICKLY',
    url: site,
    inLanguage: 'sk',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${site}/produkty?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
])

onMounted(() => {
  cart.hydrate()
  wishlist.hydrate()
  locale.hydrate()
})
</script>

<template>
  <div class="min-h-dvh flex flex-col bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-default font-label-sm text-label-sm uppercase tracking-widest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container"
    >
      Preskočiť na obsah
    </a>
    <AppHeader />
    <main id="main-content" class="flex-grow flex flex-col w-full relative main-content-safe" :inert="hasOverlay || undefined">
      <slot />
    </main>
    <AppFooter :inert="hasOverlay || undefined" />
    <MobileBottomNav :inert="hasOverlay || undefined" />
    <CartDrawer />
    <SearchOverlay />
    <ChatWidget />
  </div>
</template>
