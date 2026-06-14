<script setup lang="ts">
import { HERO_VIDEO } from '~/data/media'

interface VideoTest {
  id: string
  title: string
  category: string
  duration: string
  image: string
}

const videos: VideoTest[] = [
  {
    id: 'ceramic-shield-test',
    title: 'Ceramic Shield V2: Test odolnosti po 12 mesiacoch',
    category: 'Keramická ochrana',
    duration: '4:32',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFeLCzCRH0LSuRZZu7vq8EHmh_ZfKZs3lRqMinCgY-t2nvPamXbDW-1QesEYqoWglhm7f5oTyetNLtG5GM-QQ3u17QuFBhMwa1R5N2q6PLc_Lz9qkNXBkBQHALmYdPeSHCIqJ5QJHHOe2WBXsK9vwgao5BBw9NCbIRhAJsGyca6_iZq-Ewn_Nnsl__qtJdGieJoqtUW2Gs8pTHof_-c4dqu0vnJdJaYL_kj4BaSV5cDxxUcHefEGTGYnRVqE5z9ZDayG3icxAbwxLu',
  },
  {
    id: 'hydro-gloss-test',
    title: 'Hydro-Gloss Detail: Aplikácia krok za krokom',
    category: 'Detailing',
    duration: '6:15',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwVLLC72kxs5I2fnpz7wDAAhtOuJ-_8-cHosfMmQMM63jEl8Qo8FkMAk20c9rIdxHLvhp3y7NfpV-PCuEfO3_9Hku_i0JreEqtE5cVk7bA_qvzac3SfAb5D465b-OmQYKA_FL2_vP5maqf_CF9C8UZW5WXHTSZcamJbjjc6J7iHaqLS3BMKNnoxMU_pqQYOknynIYDAC6T7WUn_9LJW45UjAR-7gz8vfonrS53FvEMNlJHD24unDTreD8-zD4VKRp1CH-eTn73AJVo',
  },
  {
    id: 'wheel-cleaner-test',
    title: 'Alloy Wheel Cleaner Pro: Extrémne znečistené disky',
    category: 'Kolesá',
    duration: '3:48',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjJhaegdVwDaUbbbxP7bA-jd2n0qC0zIeXdAJNfRLjPz_3GxRHtkS2n6H9b7KYI8dPpEo3Xnkbj9BYmiTIgRK9AF_4InoaBujMAQowcAm8o6MCeQyPiZAeWpUokziyU4BB-6b_UnWLZR4-D2o9Gr4bSL4KBF_nWHTKmfFkM7a_o2rF9O39Lig1d7GAPVLoPaYoh5bbTDQO2spYJJ1O2EiJMYQVHrn2EgngAUNtLHNmKLsYPxLsv3mvY44XA6BXnTZgiOpr2-d4mZ3n',
  },
  {
    id: 'interior-revive-test',
    title: 'Interior Revive Foam: Hĺbkové čistenie interiéru',
    category: 'Interiér',
    duration: '5:02',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDUIlL6gCDbQzkzD3xw3uU2u9AAhFHCe7Nt3NRZ0phtbf41TlYyf9_Rxm-HPeg0eSpFTwijP-2unSr9UMFdmQDBKeSIGZ_hxRJNGDU5YU3HbkuogK1HBK0PBU6wLU_c6ExItw1bqYPx6aYcNfYcxln54ppmdDnswAbJbMTP9wpWyktHaUaT9z578MbbYq-SM-EsfIUkgi4qK2H5nQEN_KM6DAuJKFSpeoB0Nr_Ru-tX3E8ssQpdfeBfpnIBVkhTAHvokbU4XF-4bZLU',
  },
]

const activeVideo = ref<VideoTest | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)
let previouslyFocused: HTMLElement | null = null

function openVideo(video: VideoTest) {
  activeVideo.value = video
}

function closeVideo() {
  activeVideo.value = null
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && activeVideo.value) closeVideo()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

watch(activeVideo, (video) => {
  if (!import.meta.client) return
  document.body.style.overflow = video ? 'hidden' : ''
  if (video) {
    previouslyFocused = document.activeElement as HTMLElement
    nextTick(() => closeBtn.value?.focus())
  } else {
    previouslyFocused?.focus()
  }
})
</script>

<template>
  <section class="w-full relative py-stack-lg md:py-section-padding-lg bg-surface">
    <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin flex flex-col gap-stack-md md:gap-12">
      <div class="flex flex-col gap-1 border-b border-grid-line pb-stack-sm md:pb-6">
        <h2 class="font-headline-md text-headline-md md:text-headline-lg text-on-surface uppercase tracking-tight">Video testy</h2>
        <p class="font-body-md text-body-md text-on-surface-variant">Pozrite si naše produkty v akcii – nezávislé testy a recenzie.</p>
      </div>

      <!-- Mobile: horizontal scroll -->
      <div class="md:hidden flex gap-stack-sm overflow-x-auto px-gutter -mx-gutter hide-scrollbar snap-x">
        <button
          v-for="video in videos"
          :key="video.id"
          type="button"
          class="min-w-[260px] snap-start flex flex-col gap-stack-sm text-left cursor-pointer group rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :aria-label="`Prehrať video: ${video.title}`"
          @click="openVideo(video)"
        >
          <div class="relative aspect-video w-full overflow-hidden bg-on-background">
            <img :src="video.image" :alt="`Náhľad videa – ${video.title}`" loading="lazy" class="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-300 group-hover:scale-105" />
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="material-symbols-outlined text-[48px] text-on-primary drop-shadow" aria-hidden="true">play_circle</span>
            </div>
            <span class="absolute bottom-2 right-2 font-technical-data text-technical-data text-on-primary bg-on-background/70 px-2 py-0.5">{{ video.duration }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="font-technical-data text-technical-data uppercase text-secondary tracking-widest">{{ video.category }}</span>
            <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors duration-200">{{ video.title }}</h3>
          </div>
        </button>
      </div>

      <!-- Desktop: grid -->
      <div class="hidden md:grid grid-cols-4 gap-x-6 gap-y-8">
        <button
          v-for="video in videos"
          :key="video.id"
          type="button"
          class="flex flex-col gap-stack-sm text-left cursor-pointer group rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :aria-label="`Prehrať video: ${video.title}`"
          @click="openVideo(video)"
        >
          <div class="relative aspect-video w-full overflow-hidden bg-on-background">
            <img :src="video.image" :alt="`Náhľad videa – ${video.title}`" loading="lazy" class="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-300 group-hover:scale-105" />
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="material-symbols-outlined text-[48px] text-on-primary drop-shadow transition-transform duration-200 group-hover:scale-110" aria-hidden="true">play_circle</span>
            </div>
            <span class="absolute bottom-2 right-2 font-technical-data text-technical-data text-on-primary bg-on-background/70 px-2 py-0.5">{{ video.duration }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="font-technical-data text-technical-data uppercase text-secondary tracking-widest">{{ video.category }}</span>
            <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors duration-200">{{ video.title }}</h3>
          </div>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="activeVideo"
          class="fixed inset-0 z-[60] bg-on-background/80"
          @click="closeVideo"
        />
      </Transition>

      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="activeVideo"
          class="fixed inset-0 z-[70] flex items-center justify-center px-gutter"
          role="dialog"
          aria-modal="true"
          :aria-label="activeVideo.title"
        >
          <div class="w-full max-w-3xl bg-on-background flex flex-col gap-stack-sm shadow-xl">
            <div class="flex items-center justify-between px-stack-md py-stack-sm">
              <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-primary truncate">{{ activeVideo.title }}</span>
              <button
                ref="closeBtn"
                type="button"
                aria-label="Zavrieť video"
                class="min-w-11 min-h-11 -mr-2 flex items-center justify-center text-on-primary/70 hover:text-on-primary cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container"
                @click="closeVideo"
              >
                <span class="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </div>
            <video class="w-full aspect-video bg-black" controls autoplay :src="HERO_VIDEO" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
