<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rating: number
    size?: number
  }>(),
  { size: 16 },
)

const rounded = computed(() => Math.round(props.rating))
</script>

<template>
  <span class="flex items-center gap-0.5" aria-hidden="true">
    <span
      v-for="n in 5"
      :key="n"
      class="material-symbols-outlined"
      :class="n <= rounded ? 'text-secondary-container' : 'text-outline-variant'"
      :style="{ fontSize: `${size}px`, fontVariationSettings: n <= rounded ? `'FILL' 1` : `'FILL' 0` }"
    >star</span>
  </span>
</template>
