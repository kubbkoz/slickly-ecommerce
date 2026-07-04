<script setup lang="ts">
import { Frown } from 'lucide-vue-next';

interface CategoryItem {
    id: string;
    name: string;
    url: string;
}

defineProps<{ categories: CategoryItem[] }>();
const emit = defineEmits<{ (e: 'close'): void }>();
</script>

<template>
    <div class="flex flex-col items-center justify-center text-center w-full min-h-[480px] py-12">
        <Frown class="w-14 h-14 mb-5 text-gray-300" :stroke-width="1.3" />
        <h3 class="text-2xl font-black uppercase tracking-widest mb-3 text-black font-tech">
            Váš košík je prázdny
        </h3>

        <BaseButton
            variant="brand-outline"
            class="mt-4 px-8 py-3.5"
            @click="emit('close')"
        >
            Vybrať niečo zaujímavé
        </BaseButton>

        <div class="mt-10 w-full max-w-xs mx-auto">
            <p class="text-[10px] font-sans text-gray-400 tracking-widest mb-4">Hľadám kategóriu:</p>
            <div class="flex flex-wrap gap-2 justify-center">
                <NuxtLink
                    v-for="cat in categories"
                    :key="cat.id"
                    :to="cat.url"
                    class="px-4 py-2 bg-gray-50 border border-gray-100 hover:bg-gray-100 text-black text-[10px] font-bold tracking-wide transition-colors font-sans"
                    @click="emit('close')"
                >
                    {{ cat.name }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
