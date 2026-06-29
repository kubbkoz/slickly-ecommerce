<script setup lang="ts">
import { ref } from 'vue';
import { Loader2, Camera } from 'lucide-vue-next';

const props = defineProps<{ user: any, currentAvatar?: string }>();
const emit = defineEmits<{ (e: 'open-avatar-modal'): void }>();

const profileFirstName = ref(props.user?.firstName || '');
const profileLastName = ref(props.user?.lastName || '');
const profileBirthday = ref(props.user?.birthday || '');
const isSavingProfile = ref(false);
</script>

<template>
  <div class="animate-fade-in space-y-6">
    <div class="bg-white p-8 shadow-sm">
        <div class="pb-5 border-b border-gray-100 mb-6">
            <h2 class="text-xl font-black uppercase tracking-wide font-tech">Osobné údaje</h2>
        </div>
        <div class="max-w-xl">
            <!-- Profilová fotka -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-black font-black text-xl flex-shrink-0 overflow-hidden relative group border-2 border-gray-200">
                    <img v-if="currentAvatar" :src="currentAvatar" alt="avatar" class="w-full h-full object-cover transition-all group-hover:brightness-75" />
                    <button @click="emit('open-avatar-modal')" type="button" class="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 transition-all rounded-full" aria-label="Zmeniť avatar">
                        <Camera class="w-6 h-6 text-white drop-shadow-md" />
                    </button>
                </div>
                <div>
                    <h3 class="text-xs font-bold text-black uppercase tracking-widest mb-1">Profilová fotografia</h3>
                    <p class="text-[11px] text-gray-500 mb-3 font-sans">Zmeňte svoj vzhľad v systéme a na fórach.</p>
                    <button @click="emit('open-avatar-modal')" type="button" class="text-[10px] font-bold uppercase tracking-widest text-brand hover:text-white transition-colors border border-brand hover:bg-brand px-4 py-2 bg-transparent">
                        Zmeniť avatar
                    </button>
                </div>
            </div>

            <form class="space-y-6" @submit.prevent>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Meno</label>
                        <input v-model="profileFirstName" type="text" class="w-full px-5 py-3 bg-gray-50 border border-gray-200 text-sm font-medium text-black focus:outline-none focus:border-brand transition-colors rounded-none" />
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Priezvisko</label>
                        <input v-model="profileLastName" type="text" class="w-full px-5 py-3 bg-gray-50 border border-gray-200 text-sm font-medium text-black focus:outline-none focus:border-brand transition-colors rounded-none" />
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Dátum narodenia</label>
                    <input v-model="profileBirthday" type="date" class="w-full px-5 py-3 bg-gray-50 border border-gray-200 text-sm font-medium text-black focus:outline-none focus:border-brand transition-colors rounded-none" />
                    <p class="text-[10px] text-brand mt-2 font-bold italic tracking-wide">Ak budete mať sviatok, možno vám príde nejaký darček :)</p>
                </div>
                <div>
                    <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
                    <input :value="user?.email" type="email" disabled class="w-full px-5 py-3 bg-gray-50 border border-gray-100 text-sm font-medium text-gray-400 rounded-none cursor-not-allowed" />
                    <p class="text-[10px] text-gray-400 mt-2 font-sans">Email nie je možné zmeniť.</p>
                </div>
                <div class="pt-8 mt-4 border-t border-gray-100">
                    <h3 class="text-[12px] font-bold uppercase tracking-widest text-black mb-5">Zmena hesla</h3>
                    <div class="space-y-4">
                        <input type="password" placeholder="Aktuálne heslo" class="w-full px-5 py-3 bg-gray-50 border border-gray-200 text-sm font-medium text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors rounded-none" />
                        <input type="password" placeholder="Nové heslo" class="w-full px-5 py-3 bg-gray-50 border border-gray-200 text-sm font-medium text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors rounded-none" />
                    </div>
                </div>
                <div class="pt-8 flex items-center justify-between">
                    <button type="submit" class="px-10 py-3.5 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand transition-colors duration-200">
                        <Loader2 v-if="isSavingProfile" class="w-4 h-4 animate-spin" />
                        <span v-else>Uložiť zmeny</span>
                    </button>
                    <button type="button" class="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors underline">
                        Zmazať účet
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Passkey management — pridanie/správa biometrického prihlasovania -->
    <ClientOnly>
      <PasskeyManager v-if="user?.email" :email="user.email" />
    </ClientOnly>
  </div>
</template>
