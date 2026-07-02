<script setup lang="ts">
const props = withDefaults(defineProps<{
  isVisible?: boolean;
}>(), {
  isVisible: false
});

// Simulated 0→100% progress — classic "trickle" bar (NProgress-style): auto-advances
// towards 90% while loading (asymptotic, never actually reaching 100 on its own), then
// snaps to 100% the instant isVisible flips false, giving a genuine "started at 0,
// finished at 100" feel without needing real byte-level load progress (not available
// for SPA navigations).
const progress = ref(0);
let progressTimer: ReturnType<typeof setInterval> | null = null;

function startProgress() {
  progress.value = 0;
  if (import.meta.server) return; // no real timers during SSR render
  if (progressTimer) clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (progress.value >= 90) return;
    progress.value += (90 - progress.value) * 0.1;
  }, 200);
}

function completeProgress() {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  progress.value = 100;
}

watch(() => props.isVisible, (visible) => {
  if (visible) startProgress();
  else completeProgress();
}, { immediate: true });

onBeforeUnmount(() => {
  if (progressTimer) clearInterval(progressTimer);
});
</script>

<template>
  <!--
    v-if=true: overlay is completely removed from DOM when not loading.
    No v-show flash, no CSS transition flash on mount.
    Leave transition: smooth fade-out only for genuine long loads.
  -->
  <!--
    v-if=true: overlay is completely removed from DOM when not loading.
    No v-show flash, no CSS transition flash on mount.
    Leave transition: smooth fade-out only for genuine long loads.
  -->
  <Transition name="mt-loader">
    <div
      v-if="isVisible"
      id="mt-page-loader"
      class="mt-loader-overlay"
      aria-hidden="true"
      aria-label="Načítavam..."
    >
      <video
        class="mt-loader-bg-video"
        src="/videos/loader-bg.mp4"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
      ></video>
      <div class="mt-loader-bg-overlay"></div>
      <div class="mt-loader-inner">
        <div class="mt-loader-logo">
          <span>SL</span><span class="mt-logo-i"><span class="mt-logo-i-dot"></span>I</span><span>CKLY</span>
        </div>
        <div class="mt-loader-content">
            <div class="mt-loader-bar-track">
              <div class="mt-loader-bar-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="mt-loader-text">Slickly is loading ...</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.mt-loader-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.mt-loader-bg-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* Darkens the video so the white logo/text stay legible over any footage */
.mt-loader-bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1;
}

.mt-loader-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.mt-loader-logo {
  font-family: 'Space Grotesk', 'Arial', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1;
  display: flex;
  gap: 0;
  color: #ffffff;
}

/* Decorative amber dot above the "I" (uppercase has no natural tittle) */
.mt-logo-i {
  position: relative;
  display: inline-block;
}
.mt-logo-i-dot {
  position: absolute;
  top: -0.32em;
  left: 50%;
  transform: translateX(-50%);
  width: 0.16em;
  height: 0.16em;
  border-radius: 9999px;
  background: #FFBF00;
}

.mt-loader-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.mt-loader-bar-track {
  width: 220px;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  overflow: hidden;
}

.mt-loader-bar-fill {
  height: 100%;
  background: #FFBF00;
  border-radius: 9999px;
  transition: width 0.2s ease-out;
}

.mt-loader-text {
    font-family: 'Space Grotesk', sans-serif;
    color: #d1d5db; /* gray-300: much better contrast on black */
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-style: italic;
}

/* Leave-only transition: smooth fade-out after long loads */
.mt-loader-leave-active {
  transition: opacity 0.3s ease;
}
.mt-loader-leave-to {
  opacity: 0;
}
/* No enter transition = no flash on mount */
</style>
