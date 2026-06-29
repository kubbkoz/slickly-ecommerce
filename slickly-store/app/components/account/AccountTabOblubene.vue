<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';

defineProps<{ wishlistItems: any[] }>();
const emit = defineEmits<{ (e: 'remove', id: string, name: string): void }>();
</script>

<template>
    <div class="bg-white shadow-sm p-8 animate-fade-in">
        <h2 class="text-xl font-black uppercase tracking-wide font-tech mb-8">Moje Obľúbené produkty</h2>
        <div v-if="wishlistItems && wishlistItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="item in wishlistItems" :key="item.id" class="group border border-gray-100 p-4 relative bg-white hover:border-black transition-colors flex flex-col h-full">
                <button @click="emit('remove', item.id, item.translated?.name || (item as any)?.name || '')" class="absolute top-4 right-4 z-10 p-2 bg-black text-white hover:bg-brand transition-colors shadow-sm">
                    <Trash2 class="w-4 h-4" />
                </button>
                <NuxtLink :to="`/detail/${item.id}`" class="block aspect-square w-full mb-4 bg-gray-50 flex items-center justify-center p-4">
                    <img :src="item?.cover?.media?.url || 'https://placehold.co/300'" class="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                </NuxtLink>
                <div class="flex-1 flex flex-col">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-black group-hover:text-brand transition-colors mb-2 line-clamp-2">
                        <NuxtLink :to="`/detail/${item.id}`">{{ item.translated?.name || (item as any)?.name }}</NuxtLink>
                    </h3>
                    <div class="mt-auto pt-4 flex items-end justify-between border-t border-gray-100">
                        <span class="font-black font-tech text-lg text-black">{{ item.calculatedPrice?.unitPrice ? item.calculatedPrice.unitPrice.toFixed(2) + ' €' : '' }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="py-16 text-center text-sm text-gray-400 bg-gray-50 border border-gray-100">
            Zatiaľ nemáte žiadne obľúbené produkty.
        </div>
    </div>
</template>
