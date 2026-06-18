<script setup lang="ts">
import { categories } from '~/data/products'

const search = useSearchStore()
const router = useRouter()
const mobileInput = ref<HTMLInputElement | null>(null)

const { results, recommended, featured } = useSearchSuggestions(computed(() => search.query))

function submitSearch() {
  const q = search.query.trim()
  if (!q) return
  router.push({ path: '/produkty', query: { q } })
  search.close()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') search.close()
}

let scrollY = 0
let previouslyFocused: HTMLElement | null = null
watch(
  () => search.isOpen,
  (open) => {
    if (!import.meta.client) return
    if (open) {
      previouslyFocused = document.activeElement as HTMLElement
      window.addEventListener('keydown', onKeydown)
      const isMobile = window.matchMedia('(max-width: 767px)').matches
      if (isMobile) {
        scrollY = window.scrollY
        document.body.classList.add('overflow-locked')
        document.body.style.top = `-${scrollY}px`
        nextTick(() => mobileInput.value?.focus())
      }
    } else {
      window.removeEventListener('keydown', onKeydown)
      const isMobile = window.matchMedia('(max-width: 767px)').matches
      if (isMobile) {
        document.body.classList.remove('overflow-locked')
        document.body.style.top = ''
        window.scrollTo(0, scrollY)
      }
      previouslyFocused?.focus()
    }
  },
)

onBeforeUnmount(() => {
  if (search.isOpen) {
    window.removeEventListener('keydown', onKeydown)
    document.body.classList.remove('overflow-locked')
    document.body.style.top = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <!-- Desktop backdrop (click-outside to close the header dropdown) -->
    <div
      v-if="search.isOpen"
      class="hidden md:block fixed inset-0 z-40 bg-on-background/20"
      @click="search.close()"
    />

    <!-- Mobile fullscreen panel -->
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="search.isOpen"
        class="md:hidden fixed inset-0 z-[80] bg-background flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Vyhľadávanie"
      >
        <div class="flex items-center gap-stack-sm px-gutter h-16 border-b border-grid-line shrink-0" style="margin-top: env(safe-area-inset-top, 0px)">
          <button
            type="button"
            aria-label="Zavrieť vyhľadávanie"
            class="min-w-11 min-h-11 -ml-2 flex items-center justify-center text-on-surface-variant hover:text-on-background cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="search.close()"
          >
            <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          </button>
          <form role="search" class="flex-grow relative" @submit.prevent="submitSearch">
            <input
              ref="mobileInput"
              v-model="search.query"
              type="search"
              aria-label="Vyhľadávanie"
              placeholder="Hľadať produkty, kategórie..."
              class="w-full bg-surface-container-lowest border border-grid-line text-on-background font-body-md text-body-md px-4 py-2.5 pr-10 rounded-default outline-none focus:ring-1 focus:ring-secondary-container focus:border-secondary-container"
            />
            <button
              v-if="search.query"
              type="button"
              aria-label="Vymazať vyhľadávanie"
              class="absolute right-1 top-1/2 -translate-y-1/2 min-w-11 min-h-11 flex items-center justify-center text-on-surface-variant hover:text-on-background cursor-pointer transition-colors duration-200"
              @click="search.query = ''"
            >
              <span class="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
            </button>
          </form>
        </div>

        <div class="flex-grow overflow-y-auto overscroll-y-contain px-gutter py-stack-md">
          <SearchContent
            :query="search.query"
            :results="results"
            :recommended="recommended"
            :featured="featured"
            :categories="categories"
            @select="search.close()"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
