<script setup lang="ts">
import TopBar from './navbar/TopBar.vue';
import Logo from './navbar/Logo.vue';
import NavIcons from './navbar/NavIcons.vue';
import SearchBar from './navbar/SearchBar.vue';
import DesktopNav from './navbar/DesktopNav.vue';
import { useUiState } from '../../composables/useUiState';

// Async-loaded — both are ClientOnly overlays only shown after a tap (hamburger
// menu / mobile search icon), never on initial render, but a static import
// bundled them into the navbar's own render-blocking critical-path chunk on
// every page load.
const MobileMenu = defineAsyncComponent(() => import('./navbar/MobileMenu.vue'));
const MobileSearchOverlay = defineAsyncComponent(() => import('./navbar/MobileSearchOverlay.vue'));

const { isMobileMenuOpen, isMobileSearchOpen, toggleMobileMenu, toggleMobileSearch } = useUiState();

const isHomePage = useState('isPageHome', () => false);
const isCategoryPage = useState('isPageCategory', () => false);
const isProductPage = useState('isPageProduct', () => false);

const isSimpleNavbarPage = computed(() => isProductPage.value || isCategoryPage.value);

// --- Standardized Scroll Logic (§20.1) ---
const shouldHideTopBar = computed(() => isScrolled.value);
const shouldHideDesktopNav = computed(() => isScrolled.value && (isCategoryPage.value || !isHomePage.value && !isProductPage.value));

const isScrolled = ref(false);
const isScrollingDown = ref(false);
const navbarRef = ref<HTMLElement | null>(null);
const navbarInnerRef = ref<HTMLElement | null>(null);
let lastScrollY = 0;

let scrollRAF: number | null = null;
const handleScroll = () => {
    if (scrollRAF !== null) return;
    scrollRAF = requestAnimationFrame(() => {
        scrollRAF = null;
        isScrolled.value = window.scrollY > 10;

        if (window.scrollY > lastScrollY) {
            isScrollingDown.value = true;
        } else if (window.scrollY < lastScrollY) {
            isScrollingDown.value = false;
        }
        lastScrollY = window.scrollY;

        if (import.meta.client) {
            document.documentElement.classList.toggle('is-navbar-scrolled', isScrolled.value);
        }
    });
};

onMounted(async () => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Dynamic Navbar Height logic to flawlessly support custom root font-sizes
    if (import.meta.client && navbarInnerRef.value) {
        // Measure only the static nested container to avoid including mobile overlays
        const updateHeights = (height: number) => {
            document.documentElement.style.setProperty('--navbar-height-scrolled', `${height}px`);
            if (!isScrolled.value || window.scrollY < 10) {
                document.documentElement.style.setProperty('--navbar-height-full', `${height}px`);
                document.documentElement.style.setProperty('--navbar-height-unscrolled', `${height}px`);
                document.documentElement.style.setProperty('--navbar-height-current', `${height}px`);
            }
        };
        
        const ro = new ResizeObserver((entries) => {
            if (entries[0]) {
                const height = entries[0].target.clientHeight;
                updateHeights(height);
                document.documentElement.style.setProperty('--navbar-height-current', `${height}px`);
            }
        });
        
        ro.observe(navbarInnerRef.value);
        // Defer to nextTick so DesktopNav max-height:0 CSS is applied before measuring
        await nextTick();
        updateHeights(navbarInnerRef.value.clientHeight);
    }
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    if (scrollRAF !== null) {
        cancelAnimationFrame(scrollRAF);
    }
});

// Prevent body scroll when mobile search or menu is open
watch([isMobileSearchOpen, isMobileMenuOpen], ([searchOpen, menuOpen]) => {
    if (searchOpen || menuOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});
</script>

<template>
  <div>
    <nav class="fixed top-0 start-0 w-full z-50 flex flex-col transition-transform duration-200 ease-in-out shadow-none gpu-boost"
         :class="isScrolled ? 'translate-y-0 shadow-lg' : 'translate-y-0 shadow-none'"
         ref="navbarRef">
      <div ref="navbarInnerRef">
        <!-- 1. TOP BAR — hides everywhere on scroll (§20.1) -->
        <TopBar :is-hidden="shouldHideTopBar" :is-scrolled="isScrolled" />

        <!-- 2. MAIN HEADER (Logo, Search, Icons) — persistent -->
        <div
          id="navbar-main-row"
          class="bg-black py-4 transition-all duration-150 ease-linear z-40 relative shadow-xl"
          style="background-color: #000000 !important;"
        >
          <div class="container mx-auto px-4 lg:px-8">
            <div class="flex items-center justify-between gap-8">
              
              <Logo />

              <SearchBar />

              <NavIcons />
            </div>
          </div>
        </div>

        <!-- 3. DESKTOP NAVIGATION BAR — hides ONLY on category/search on scroll (§20.1) -->
        <DesktopNav :is-scrolled="isScrolled" :is-hidden="shouldHideDesktopNav" />
      </div>

      <!-- 4 & 5. MOBILE OVERLAYS — ClientOnly aby sme zabránili hydration mismatch.
           Oba komponenty používajú <Teleport to="body"> + content závislý na session cookie
           (useUser), čo na server-render produkuje iný markup ako na klientovi. -->
      <ClientOnly>
        <MobileSearchOverlay
          :is-open="isMobileSearchOpen"
          @close="toggleMobileSearch(false)"
        />
        <MobileMenu
          :is-open="isMobileMenuOpen"
          @close="toggleMobileMenu(false)"
        />
      </ClientOnly>
    </nav>

    <!-- Spacer div to prevent layout shifts (CLS) — No transition here as it follows ResizeObserver frames (§20.2) -->
    <div 
        class="w-full pointer-events-none opacity-0"
        :style="{ height: 'var(--navbar-height-current, 169px)', willChange: 'height' }"
    ></div>
  </div>
</template>
