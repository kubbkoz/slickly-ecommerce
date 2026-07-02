<script setup lang="ts">
import { ShoppingBag, X } from 'lucide-vue-next';

defineProps<{ count: number }>();
const emit = defineEmits<{ (e: 'close'): void }>();
</script>

<template>
    <div class="flex items-center justify-between px-5 md:px-8 py-5 flex-shrink-0 border-b border-gray-100">
        <div class="flex items-center gap-3">
            <ShoppingBag class="w-4 h-4 text-gray-900" :stroke-width="1.8" />
            <h2 class="text-sm font-bold tracking-[0.2em] text-gray-900 font-sans uppercase">
                SÚČET POLOŽIEK ({{ count }})
            </h2>
        </div>
        <button
            @click="emit('close')"
            class="w-10 h-10 flex items-center justify-center bg-gray-900/5 hover:bg-gray-900/10 text-gray-900 transition-all rounded-sm"
            aria-label="Zavrieť košík"
        >
            <X class="w-4 h-4" />
        </button>
    </div>
</template>
