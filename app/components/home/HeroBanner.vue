<script setup lang="ts">
import { HERO_IMAGE, HERO_VIDEO } from '~/data/media'

// SSR renders only the poster images (great for LCP + no wasted bandwidth).
// After mount we detect the active breakpoint and reduced-motion preference,
// then mount the hero <video> for that breakpoint ONLY — so the 2.4 MB clip
// is fetched at most once, never twice, and never when motion is reduced.
const isMobile = ref<boolean | null>(null)
const allowMotion = ref(false)

let mqCleanup: (() => void) | undefined
onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  allowMotion.value = !reduce
  const mq = window.matchMedia('(max-width: 767px)')
  isMobile.value = mq.matches
  const handler = (e: MediaQueryListEvent) => { isMobile.value = e.matches }
  mq.addEventListener('change', handler)
  mqCleanup = () => mq.removeEventListener('change', handler)
})
onBeforeUnmount(() => { mqCleanup?.() })

const showMobileVideo = computed(() => allowMotion.value && isMobile.value === true)
const showDesktopVideo = computed(() => allowMotion.value && isMobile.value === false)

useHead({
  link: [
    { rel: 'preload', as: 'video', href: HERO_VIDEO, type: 'video/mp4' },
  ],
})
</script>

<template>
  <section class="relative w-full overflow-hidden">
    <!-- Mobile hero -->
    <div class="md:hidden relative aspect-square w-full overflow-hidden">
      <NuxtImg
        :src="HERO_IMAGE"
        alt=""
        aria-hidden="true"
        fetchpriority="high"
        preload
        width="600"
        height="600"
        sizes="640px md:1024px"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <video
        v-if="showMobileVideo"
        class="absolute inset-0 w-full h-full object-cover"
        autoplay
        muted
        loop
        playsinline
        aria-hidden="true"
      >
        <source :src="HERO_VIDEO" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-primary/40 z-10"></div>
      <div class="relative z-20 h-full flex flex-col justify-end p-gutter pb-stack-lg">
        <span class="text-secondary-container font-badge-label text-badge-label uppercase tracking-widest mb-stack-sm">Novinka: V2 Séria</span>
        <h1 class="font-headline-xl text-headline-xl text-on-primary max-w-[320px] leading-tight mb-stack-md">
          TECHNICKÁ <br />DOKONALOSŤ <br />PRE VAŠE AUTO
        </h1>
        <NuxtLink
          to="/produkty"
          class="bg-primary text-on-primary px-stack-lg py-3 rounded-default font-label-sm text-label-sm uppercase tracking-widest transition-[background-color,transform,opacity] duration-200 active:scale-[0.99] w-fit cursor-pointer hover:bg-primary/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary"
        >
          Preskúmať kolekciu
        </NuxtLink>
      </div>
    </div>

    <!-- Desktop hero -->
    <div class="hidden md:block relative w-full aspect-video bg-on-background overflow-hidden">
      <NuxtImg
        :src="HERO_IMAGE"
        alt=""
        aria-hidden="true"
        fetchpriority="high"
        preload
        width="800"
        height="450"
        sizes="640px md:1024px"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <video
        v-if="showDesktopVideo"
        class="absolute inset-0 w-full h-full object-cover"
        autoplay
        muted
        loop
        playsinline
        aria-hidden="true"
      >
        <source :src="HERO_VIDEO" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-primary/40"></div>
      <div class="relative z-10 h-full max-w-[1536px] mx-auto px-grid-margin flex flex-col justify-center gap-4">
        <span class="bg-secondary-container text-on-secondary-container px-3 py-1 font-badge-label text-badge-label w-fit uppercase">Limitovaná ponuka</span>
        <h1 class="text-on-primary font-display-lg text-display-lg uppercase">Špeciálna zľava -20%</h1>
        <p class="text-on-primary/70 font-body-md max-w-md">
          Získajte exkluzívny prístup k našej prémiovej rade keramickej ochrany za zvýhodnenú cenu.
        </p>
        <NuxtLink
          to="/produkty"
          class="mt-4 bg-on-primary text-primary px-stack-lg h-12 rounded-default font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center transition-[background-color,transform,opacity] duration-200 active:scale-[0.99] w-fit cursor-pointer hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary"
        >
          Kúpiť teraz
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
