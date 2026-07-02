<script setup lang="ts">
const props = withDefaults(defineProps<{
  isVisible?: boolean;
}>(), {
  isVisible: false
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
      <div class="mt-loader-inner">
        <div class="mt-loader-logo">
          <span>SL</span><span class="mt-logo-i"><span class="mt-logo-i-dot"></span>I</span><span>CKLY</span>
        </div>
        <div class="mt-loader-content">
            <div class="mt-loader-bar-track">
              <div class="mt-loader-bar-fill"></div>
            </div>
            <div class="mt-loader-text">loading experience ...</div>
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
}

.mt-loader-inner {
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
  width: 140px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  border-radius: 999px;
  position: relative;
}

.mt-loader-bar-fill {
  height: 100%;
  width: 30%;
  background: var(--brand-color);
  border-radius: 999px;
  position: absolute;
  animation: mt-bar-slide 1.5s cubic-bezier(0.65, 0.05, 0.36, 1) infinite;
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

@keyframes mt-bar-slide {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(150%); }
  100% { transform: translateX(400%); }
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
