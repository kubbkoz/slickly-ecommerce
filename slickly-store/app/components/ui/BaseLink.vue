<script setup lang="ts">
import { computed } from 'vue';
import { useNuxtApp } from '#app';
/**
 * SLICKLY Smart Link Component
 * Part of the "Native URL Resolution" system.
 * 
 * This component automatically resolves URLs for Products, Categories, 
 * or plain paths using the global $url helper.
 * 
 * Usage:
 * <BaseLink :to="product">Product Name</BaseLink>
 * <BaseLink :to="category">Category</BaseLink>
 * <BaseLink :to="'/some-path'">Static Page</BaseLink>
 */
const props = defineProps<{
    /** The target entity or path. Can be a Product object, Category object, or String. */
    to: any;
    /** Force external link behavior. */
    external?: boolean;
}>();

const { $url } = useNuxtApp();

// Automatically resolves the SEO URL based on entity type and locale.
const resolvedTo = computed(() => $url(props.to));

// Detect if it's an external link (http, mailto, tel) or forced via prop.
const isExternal = computed(() => {
    if (props.external) return true;
    if (typeof props.to !== 'string') return false;
    return props.to.startsWith('http') || props.to.startsWith('mailto:') || props.to.startsWith('tel:');
});
</script>

<template>
    <a 
        v-if="isExternal" 
        v-bind="$attrs"
        :href="String(to)" 
        target="_blank" 
        rel="noopener noreferrer" 
    >
        <slot />
    </a>
    <NuxtLink 
        v-else 
        v-bind="$attrs"
        :to="resolvedTo" 
    >
        <slot />
    </NuxtLink>
</template>

<style scoped>
/* BaseLink is a zero-styled wrapper to maintain NuxtLink behavior */
a {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
}
</style>
