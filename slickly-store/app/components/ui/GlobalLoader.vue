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
            <div class="mt-loader-spinner"></div>
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

.mt-loader-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 191, 0, 0.2);
  border-top-color: #FFBF00;
  border-radius: 9999px;
  animation: mt-spinner-spin 0.8s linear infinite;
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

@keyframes mt-spinner-spin {
  to { transform: rotate(360deg); }
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
