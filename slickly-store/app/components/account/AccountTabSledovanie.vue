<script setup lang="ts">
import { Package, Settings, MapPin } from 'lucide-vue-next';
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="bg-white p-8 shadow-sm">
            <h2 class="text-xl font-black uppercase tracking-wide font-tech mb-6">Sledovanie objednávky</h2>
            <div class="max-w-xl">
                <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Číslo zásielky / objednávky</label>
                <div class="flex">
                    <input type="text" placeholder="Napr. 20268892" class="w-full bg-gray-50 border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                    <button class="bg-brand text-white px-8 font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-colors">Hľadať</button>
                </div>
                <p class="text-[11px] text-gray-400 mt-3 font-medium italic">Zadajte číslo objednávky alebo sledovacie číslo od kuriéra.</p>
            </div>
        </div>

        <div class="bg-white p-8 shadow-sm">
            <div class="flex justify-between items-center mb-10">
                <div>
                    <h3 class="text-base font-black uppercase tracking-widest font-tech text-black mb-2">Aktívna objednávka #20268892</h3>
                    <p class="text-sm text-gray-600">Predpokladané doručenie: <strong class="text-black">Zajtra</strong></p>
                </div>
                <span class="px-5 py-2 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest">Odoslané</span>
            </div>
            <div class="relative flex justify-between items-center max-w-4xl pt-4">
                <div class="absolute top-8 left-6 right-6 h-1 bg-gray-100 -z-10"></div>
                <div class="absolute top-8 left-6 h-1 bg-brand -z-10" style="width: 70%;"></div>
                <div class="flex flex-col items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center shrink-0"><Package class="w-5 h-5" /></div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Prijaté</span>
                </div>
                <div class="flex flex-col items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center shrink-0"><Settings class="w-5 h-5 animate-spin-slow" /></div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Spracováva sa</span>
                </div>
                <div class="flex flex-col items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center shrink-0"><Package class="w-5 h-5" /></div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-brand">Odoslané</span>
                </div>
                <div class="flex flex-col items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-white border-2 border-gray-200 text-gray-300 flex items-center justify-center shrink-0"><MapPin class="w-5 h-5" /></div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Doručené</span>
                </div>
            </div>
        </div>
    </div>
</template>
