<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { Plus, Edit2, X, MapPin, Loader2, CheckCircle, Trash2, ShieldCheck, Tag, XCircle, AlertCircle } from 'lucide-vue-next';
// @ts-ignore
import { useShopwareContext, useCountries, useSalutations, useUser } from '@shopware/composables';

const props = defineProps<{
    customerAddresses: any[];
    user: any;
}>();

const emit = defineEmits<{ (e: 'refresh'): void }>();

const { apiClient } = useShopwareContext();
const { getCountries, fetchCountries } = useCountries();
const { getSalutations, fetchSalutations } = useSalutations();
const { refreshUser } = useUser();

onMounted(async () => {
    await Promise.all([fetchCountries(), fetchSalutations()]);
});

// Zoznam adries triedime tak, aby predvolené boli hore
const sortedAddresses = computed(() => {
    if (!props.customerAddresses) return [];
    return [...props.customerAddresses].sort((a, b) => {
        const aDef = a.id === props.user?.defaultBillingAddressId || a.id === props.user?.defaultShippingAddressId;
        const bDef = b.id === props.user?.defaultBillingAddressId || b.id === props.user?.defaultShippingAddressId;
        if (aDef && !bDef) return -1;
        if (!aDef && bDef) return 1;
        return 0;
    });
});

// State pre formulár
const isDrawerOpen = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const error = ref<string | null>(null);

// VIES real-time validácia
const viesStatus = ref<'idle' | 'loading' | 'valid' | 'invalid' | 'error'>('idle');
const viesCompanyName = ref('');
const viesError = ref('');
let viesDebounceTimer: ReturnType<typeof setTimeout> | null = null;

async function validateVies(vatId: string) {
    const cleaned = vatId.trim().replace(/\s/g, '');
    
    if (!cleaned || cleaned.length < 4) {
        viesStatus.value = 'idle';
        viesCompanyName.value = '';
        viesError.value = '';
        return;
    }
    
    // Regex: 2-písmenkový country code + aspoň 2 číslice
    if (!/^[A-Za-z]{2}\d{2,}/.test(cleaned)) {
        viesStatus.value = 'idle';
        viesError.value = 'Formát: SK1234567890';
        return;
    }
    
    viesStatus.value = 'loading';
    viesCompanyName.value = '';
    viesError.value = '';
    
    try {
        const result = await $fetch<{ valid: boolean; name?: string; error?: string }>('/api/vies-validate', {
            query: { vatId: cleaned },
        });
        
        if (result.valid) {
            viesStatus.value = 'valid';
            viesCompanyName.value = result.name || '';
            viesError.value = '';
            
            // VŽDY prepísať názov spoločnosti z VIES pri novom overení
            if (result.name) {
                form.value.company = result.name;
            }
            
            // VŽDY prepísať DIČ pre SK/CZ pri novom overení
            if (cleaned.startsWith('SK') || cleaned.startsWith('CZ')) {
                form.value.dic = cleaned.substring(2);
            }
        } else {
            viesStatus.value = 'invalid';
            viesCompanyName.value = '';
            viesError.value = result.error || 'IČ DPH nie je registrované v systéme VIES.';
        }
    } catch (err: any) {
        viesStatus.value = 'error';
        viesCompanyName.value = '';
        viesError.value = err?.data?.message || err?.statusMessage || 'VIES služba nedostupná.';
    }
}

const form = ref({
    id: '',
    salutationId: '',
    firstName: '',
    lastName: '',
    isCompany: false,
    company: '',
    vatId: '',
    ico: '',
    dic: '',
    phoneNumber: '',
    email: '',
    street: '',
    zipcode: '',
    city: '',
    countryId: '',
    isDefaultBilling: false,
    isDefaultShipping: false,
});

// Watch MUSÍ byť za deklaráciou form
watch(() => form.value.vatId, (newVal) => {
    if (viesDebounceTimer) clearTimeout(viesDebounceTimer);
    
    if (!newVal?.trim()) {
        viesStatus.value = 'idle';
        viesCompanyName.value = '';
        viesError.value = '';
        return;
    }
    
    viesDebounceTimer = setTimeout(() => {
        validateVies(newVal);
    }, 800);
});

// Reset firemných polí pri odkliknutí "Nakupujem na firmu"
watch(() => form.value.isCompany, (isCompany) => {
    if (!isCompany) {
        form.value.company = '';
        form.value.vatId = '';
        form.value.ico = '';
        form.value.dic = '';
        viesStatus.value = 'idle';
        viesCompanyName.value = '';
        viesError.value = '';
    }
});

function openAddDrawer() {
    isEditing.value = false;
    error.value = null;
    viesStatus.value = 'idle';
    viesCompanyName.value = '';
    viesError.value = '';
    form.value = {
        id: '',
        salutationId: getSalutations.value?.[0]?.id || '',
        firstName: props.user?.firstName || '',
        lastName: props.user?.lastName || '',
        isCompany: false,
        company: '',
        vatId: '',
        ico: '',
        dic: '',
        phoneNumber: '',
        email: '',
        street: '',
        zipcode: '',
        city: '',
        countryId: getCountries.value?.find((c: any) => c.iso === 'SK' || c.iso3 === 'SVK')?.id || '',
        isDefaultBilling: false,
        isDefaultShipping: false,
    };
    isDrawerOpen.value = true;
}

function openEditDrawer(address: any) {
    isEditing.value = true;
    error.value = null;
    viesStatus.value = 'idle';
    viesCompanyName.value = '';
    viesError.value = '';
    form.value = {
        id: address.id,
        salutationId: address.salutationId || '',
        firstName: address.firstName || '',
        lastName: address.lastName || '',
        isCompany: !!address.company || !!props.user?.vatIds?.length || !!address.customFields?.mtsport_ico || !!address.customFields?.mtsport_dic || props.user?.accountType === 'business',
        company: address.company || props.user?.company || '',
        vatId: props.user?.vatIds?.[0] || '',
        ico: address.customFields?.mtsport_ico || '',
        dic: address.customFields?.mtsport_dic || '',
        phoneNumber: address.phoneNumber || '',
        email: address.customFields?.email || '',
        street: address.street || '',
        zipcode: address.zipcode || '',
        city: address.city || '',
        countryId: address.countryId || '',
        isDefaultBilling: address.id === props.user?.defaultBillingAddressId,
        isDefaultShipping: address.id === props.user?.defaultShippingAddressId,
    };
    isDrawerOpen.value = true;
    
    // Ak existuje IČ DPH, validuj okamžite
    if (form.value.vatId?.trim()) {
        validateVies(form.value.vatId);
    }
}

function closeDrawer() {
    isDrawerOpen.value = false;
    viesStatus.value = 'idle';
    viesCompanyName.value = '';
    viesError.value = '';
}

async function saveAddress() {
    if (!form.value.firstName || !form.value.lastName || !form.value.street || !form.value.city || !form.value.zipcode || !form.value.countryId) {
        error.value = 'Prosím, vyplňte všetky povinné polia.';
        return;
    }

    if (form.value.isCompany) {
        if (!form.value.vatId || !form.value.company || !form.value.ico) {
            error.value = 'Pre nákup na firmu musíte vyplniť IČ DPH, Názov spoločnosti a IČO.';
            return;
        }
    }

    isSaving.value = true;
    error.value = null;

    try {
        const payload: Record<string, any> = {
            salutationId: form.value.salutationId,
            firstName: form.value.firstName,
            lastName: form.value.lastName,
            street: form.value.street,
            zipcode: form.value.zipcode,
            city: form.value.city,
            countryId: form.value.countryId,
        };

        if (form.value.isCompany) {
            payload.company = form.value.company || null;
        } else {
            payload.company = null;
        }

        payload.phoneNumber = form.value.phoneNumber || null;
        
        payload.customFields = {} as Record<string, any>;
        if (form.value.email) payload.customFields.email = form.value.email;
        if (form.value.isCompany) {
            if (form.value.ico) payload.customFields.mtsport_ico = form.value.ico;
            if (form.value.dic) payload.customFields.mtsport_dic = form.value.dic;
        } else {
            // Explicitne vymazať firemné custom fieldy
            payload.customFields.mtsport_ico = null;
            payload.customFields.mtsport_dic = null;
        }
        
        if (Object.keys(payload.customFields).every(k => payload.customFields[k] === null || payload.customFields[k] === undefined) && !form.value.email) {
            // Ak sú všetky null a nie je email, stále pošli — Shopware potrebuje null na vymazanie
        }

        let addressId = form.value.id;
        if (isEditing.value) {
            await apiClient.invoke('updateCustomerAddress patch /account/address/{addressId}' as any, {
                pathParams: { addressId: form.value.id },
                body: payload as any
            });
        } else {
            const result = await apiClient.invoke('createCustomerAddress post /account/address' as any, {
                body: payload as any
            });
            addressId = (result as any)?.data?.id || (result as any)?.id;
        }

        if (form.value.isDefaultBilling && addressId) {
            await apiClient.invoke('defaultBillingAddress patch /account/address/default-billing/{addressId}' as any, { pathParams: { addressId } });
        }
        if (form.value.isDefaultShipping && addressId) {
            await apiClient.invoke('defaultShippingAddress patch /account/address/default-shipping/{addressId}' as any, { pathParams: { addressId } });
        }

        // Shopware ukladá IČ DPH (vatId) na Customer entitu, nie na Address.
        // Endpoint changeProfile s accountType: 'business' + vatIds[] spúšťa VIES validáciu.
        if (form.value.isCompany && form.value.company) {
            const profilePayload: Record<string, any> = {
                salutationId: form.value.salutationId || props.user?.salutationId,
                firstName: props.user?.firstName || form.value.firstName,
                lastName: props.user?.lastName || form.value.lastName,
                accountType: 'business',
                company: form.value.company,
            };
            
            if (form.value.vatId?.trim()) {
                profilePayload.vatIds = [form.value.vatId.trim()];
            } else {
                profilePayload.vatIds = [];
            }

            try {
                await apiClient.invoke('changeProfile post /account/change-profile' as any, {
                    body: profilePayload as any,
                });
            } catch (profileErr: any) {
                console.error('Profile/VAT update error:', profileErr);
                const vatError = profileErr?.details?.errors?.[0]?.detail 
                    || profileErr?.data?.errors?.[0]?.detail 
                    || profileErr?.message || '';
                
                // VIES validácia zlyhala — adresa sa uložila, ale IČ DPH nie
                if (vatError.toLowerCase().includes('vat') || vatError.toLowerCase().includes('vies')) {
                    error.value = `Adresa bola uložená, ale IČ DPH "${form.value.vatId}" neprešlo VIES overením. Skontrolujte správnosť čísla.`;
                } else {
                    error.value = `Adresa bola uložená, ale nepodarilo sa aktualizovať firemné údaje: ${vatError}`;
                }
                
                await refreshUser().catch(() => {});
                emit('refresh');
                isSaving.value = false;
                return;
            }
        } else if (!form.value.isCompany && (props.user?.accountType === 'business' || props.user?.company || props.user?.vatIds?.length)) {
            // Zákazník zrušil firmu — prepnúť späť na privátny účet
            try {
                await apiClient.invoke('changeProfile post /account/change-profile' as any, {
                    body: {
                        salutationId: props.user?.salutationId,
                        firstName: props.user?.firstName || form.value.firstName,
                        lastName: props.user?.lastName || form.value.lastName,
                        accountType: 'private',
                    } as any,
                });
            } catch (e) {
                console.warn('Failed to switch back to private account:', e);
            }
        }

        await refreshUser().catch(e => console.warn('Refresh user failed', e));
        
        closeDrawer();
        emit('refresh');
    } catch (err: any) {
        console.error('Address Save Error:', err);
        const details = err?.details?.errors?.[0]?.detail || err?.data?.errors?.[0]?.detail || err?.message;
        error.value = details ? `Chyba: ${details}` : 'Nastala neznáma chyba pri ukladaní adresy. Skontrolujte konzolu.';
    } finally {
        isSaving.value = false;
    }
}

async function setDefault(addressId: string, type: 'billing' | 'shipping') {
    try {
        if (type === 'billing') {
            await apiClient.invoke('defaultBillingAddress patch /account/address/default-billing/{addressId}' as any, {
                pathParams: { addressId }
            });
        } else {
            await apiClient.invoke('defaultShippingAddress patch /account/address/default-shipping/{addressId}' as any, {
                pathParams: { addressId }
            });
        }
        refreshUser().catch(e => console.warn('Refresh user failed', e));
        emit('refresh');
    } catch (e) {
        console.error('Failed to set default address', e);
    }
}

const isDeleting = ref<string | null>(null);

async function deleteAddress(addressId: string) {
    if (!confirm('Naozaj chcete zmazať túto adresu?')) return;
    
    isDeleting.value = addressId;
    try {
        await apiClient.invoke('deleteCustomerAddress delete /account/address/{addressId}' as any, {
            pathParams: { addressId }
        });
        emit('refresh');
        if (props.user?.defaultBillingAddressId === addressId || props.user?.defaultShippingAddressId === addressId) {
            await refreshUser();
        }
    } catch (e) {
        console.error('Failed to delete address', e);
        alert('Adresu nebolo možné zmazať. Uistite sa, že nie je naviazaná na existujúcu objednávku.');
    } finally {
        isDeleting.value = null;
    }
}
</script>

<template>
    <div class="animate-fade-in bg-white p-8 shadow-sm relative">
        <div class="flex justify-between items-center mb-8 border-b border-gray-100 pb-5">
            <h2 class="text-xl font-black uppercase tracking-wide font-tech">Moje adresy</h2>
            <button @click="openAddDrawer" class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black border border-gray-200 hover:border-black px-5 py-2.5 transition-colors">
                <Plus class="w-3.5 h-3.5" />
                Pridať adresu
            </button>
        </div>

        <!-- Zoznam Adries -->
        <div v-if="sortedAddresses && sortedAddresses.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="addr in sortedAddresses" :key="addr.id" class="bg-gray-50 border border-gray-100 p-6 relative group transition-all" :class="(addr.id === user?.defaultBillingAddressId || addr.id === user?.defaultShippingAddressId) ? 'border-l-4 border-l-brand' : 'hover:border-black'">
                <!-- Badges -->
                <div class="absolute top-4 right-4 flex gap-2">
                    <span v-if="addr.id === user?.defaultBillingAddressId" class="text-[9px] font-bold text-white bg-brand px-2 py-0.5 uppercase tracking-wide flex items-center gap-1"><ShieldCheck class="w-3 h-3" /> Fakturačná</span>
                    <span v-if="addr.id === user?.defaultShippingAddressId" class="text-[9px] font-bold text-white bg-black px-2 py-0.5 uppercase tracking-wide flex items-center gap-1"><MapPin class="w-3 h-3" /> Dodacia</span>
                </div>

                <div class="mb-4 pr-32">
                    <h3 class="font-bold text-base text-black mb-1 capitalize">{{ addr.firstName }} {{ addr.lastName }}</h3>
                    <p v-if="addr.company" class="text-xs font-bold text-gray-500 flex items-center gap-1 mb-1"><Tag class="w-3 h-3" /> {{ addr.company }}</p>
                    <div v-if="addr.company || addr.customFields?.mtsport_ico" class="mt-2 text-xs text-gray-500 space-y-1 mb-3">
                        <p v-if="addr.customFields?.mtsport_ico">IČO: {{ addr.customFields.mtsport_ico }}</p>
                        <p v-if="addr.customFields?.mtsport_dic">DIČ: {{ addr.customFields.mtsport_dic }}</p>
                        <p v-if="user?.vatIds?.[0] && addr.id === user?.defaultBillingAddressId" class="flex items-center gap-1.5">
                            IČ DPH: {{ user.vatIds[0] }}
                            <span class="relative group/vies flex items-center cursor-help">
                                <CheckCircle class="w-3 h-3 text-green-500" />
                                <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/vies:block w-max bg-black text-white text-[9px] px-2 py-1 uppercase tracking-widest z-10 whitespace-nowrap">Overené cez VIES</span>
                            </span>
                        </p>
                    </div>
                </div>
                
                <p class="text-sm text-gray-600 leading-relaxed">
                    {{ addr.street }}<br>
                    {{ addr.zipcode }} {{ addr.city }}<br>
                    {{ addr.country?.name || 'Slovensko' }}
                </p>

                <div class="flex flex-wrap items-center gap-4 mt-6 border-t border-gray-100 pt-4">
                    <button @click="openEditDrawer(addr)" class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-black hover:text-brand transition-colors">
                        <Edit2 class="w-3 h-3" /> Upraviť
                    </button>
                    
                    <button @click="deleteAddress(addr.id)" class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors" :disabled="isDeleting === addr.id">
                        <Loader2 v-if="isDeleting === addr.id" class="w-3 h-3 animate-spin" />
                        <Trash2 v-else class="w-3 h-3" />
                        Zmazať
                    </button>

                    <div class="flex-1"></div>

                    <!-- Nastavenie ako predvolené - zobraziť len ak to nie je už predvolené -->
                    <div class="flex gap-2 flex-col sm:flex-row items-end sm:items-center mt-2 sm:mt-0 w-full sm:w-auto border-t border-gray-100 sm:border-0 pt-3 sm:pt-0">
                        <button v-if="addr.id !== user?.defaultBillingAddressId" @click="setDefault(addr.id, 'billing')" class="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors underline">
                            Nastaviť ako fakturačnú
                        </button>
                        <button v-if="addr.id !== user?.defaultShippingAddressId" @click="setDefault(addr.id, 'shipping')" class="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors underline">
                            Nastaviť ako dodaciu
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="py-16 text-center text-sm text-gray-400 bg-gray-50 border border-gray-100">
            Nemáte uložené žiadne adresy.
        </div>

        <!-- Aero Drawer (Modal) -->
        <Teleport to="body">
            <div v-if="isDrawerOpen" class="fixed inset-0 z-50 flex justify-end font-sans">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" @click="closeDrawer"></div>
                
                <!-- Panel -->
                <div class="relative w-full md:w-[440px] bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
                    
                    <!-- Header -->
                    <div class="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white z-10">
                        <h2 class="text-xl font-bold font-sans uppercase tracking-[0.2em] text-black">
                            {{ isEditing ? 'Úprava adresy' : 'Nová adresa' }}
                        </h2>
                        <button @click="closeDrawer" class="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-black hover:text-white transition-colors text-black shrink-0">
                            <X class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide">
                        <form id="address-form" @submit.prevent="saveAddress" class="space-y-6 pb-20">
                            
                            <div v-if="error" class="bg-red-50 text-red-600 p-4 text-sm flex gap-3 border border-red-100">
                                <X class="w-5 h-5 shrink-0" /> {{ error }}
                            </div>

                            <div class="space-y-4">
                                <h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Kontaktné údaje</h3>
                                
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="col-span-2">
                                        <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Oslovenie *</label>
                                        <select v-model="form.salutationId" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors">
                                            <option v-for="s in getSalutations" :key="s.id" :value="s.id">{{ s.displayName }}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Meno *</label>
                                        <input v-model="form.firstName" type="text" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Priezvisko *</label>
                                        <input v-model="form.lastName" type="text" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" />
                                    </div>
                                    <div class="col-span-2 sm:col-span-1">
                                        <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Telefón</label>
                                        <input v-model="form.phoneNumber" type="tel" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" />
                                    </div>
                                    <div class="col-span-2 sm:col-span-1">
                                        <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">E-mail (voliteľné)</label>
                                        <input v-model="form.email" type="email" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" />
                                    </div>
                                </div>
                            </div>

                            <!-- Typ adresy (Predvolená fakturačná / dodacia) -->
                            <div class="space-y-4 mt-6">
                                <h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Nastavenia adresy</h3>
                                <div class="flex flex-col gap-3">
                                    <label class="flex items-center gap-3 cursor-pointer group">
                                        <div class="relative flex items-center justify-center w-5 h-5 border border-gray-300 group-hover:border-black transition-colors" :class="form.isDefaultBilling ? 'bg-black border-black' : 'bg-white'">
                                            <CheckCircle v-if="form.isDefaultBilling" class="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <input type="checkbox" v-model="form.isDefaultBilling" class="hidden" />
                                        <span class="text-[11px] font-bold uppercase tracking-widest text-black">Nastaviť ako predvolenú fakturačnú</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer group">
                                        <div class="relative flex items-center justify-center w-5 h-5 border border-gray-300 group-hover:border-black transition-colors" :class="form.isDefaultShipping ? 'bg-black border-black' : 'bg-white'">
                                            <CheckCircle v-if="form.isDefaultShipping" class="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <input type="checkbox" v-model="form.isDefaultShipping" class="hidden" />
                                        <span class="text-[11px] font-bold uppercase tracking-widest text-black">Nastaviť ako predvolenú dodaciu</span>
                                    </label>
                                </div>
                            </div>

                            <div class="space-y-4 mt-6">
                                <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                                    <h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Firemné údaje</h3>
                                    <label class="flex items-center gap-2 cursor-pointer group">
                                        <span class="text-[10px] font-bold text-black uppercase tracking-widest">Nakupujem na firmu</span>
                                        <div class="relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors" :class="form.isCompany ? 'bg-black border-black' : 'bg-white'">
                                            <CheckCircle v-if="form.isCompany" class="w-3 h-3 text-white" />
                                        </div>
                                        <input type="checkbox" v-model="form.isCompany" class="hidden" />
                                    </label>
                                </div>
                                
                                <div v-if="form.isCompany" class="animate-fade-in space-y-4 mt-4">
                                    <!-- 1. IČ DPH — prvé, VIES overenie a auto-fill názvu spoločnosti -->
                                    <div>
                                        <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                                            IČ DPH *
                                            <span v-if="viesStatus === 'valid'" class="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1">
                                                <CheckCircle class="w-3 h-3" /> Overené VIES
                                            </span>
                                            <span v-else-if="viesStatus === 'invalid'" class="text-[9px] text-red-600 bg-red-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1">
                                                <XCircle class="w-3 h-3" /> Neplatné
                                            </span>
                                            <span v-else-if="viesStatus === 'error'" class="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1">
                                                <AlertCircle class="w-3 h-3" /> Nedostupné
                                            </span>
                                            <span v-else class="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 tracking-wider">Validované cez VIES</span>
                                        </label>
                                        <div class="relative">
                                            <input 
                                                v-model="form.vatId" 
                                                type="text" 
                                                placeholder="SK..." 
                                                class="w-full px-4 py-3 pr-12 bg-gray-50 border text-sm font-medium outline-none transition-colors" 
                                                :class="{
                                                    'border-green-400 bg-green-50/30': viesStatus === 'valid',
                                                    'border-red-400 bg-red-50/30': viesStatus === 'invalid',
                                                    'border-amber-400': viesStatus === 'error',
                                                    'border-gray-200 focus:border-black': viesStatus === 'idle' || viesStatus === 'loading',
                                                }"
                                            />
                                            <div class="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Loader2 v-if="viesStatus === 'loading'" class="w-5 h-5 text-gray-400 animate-spin" />
                                                <CheckCircle v-else-if="viesStatus === 'valid'" class="w-5 h-5 text-green-500" />
                                                <XCircle v-else-if="viesStatus === 'invalid'" class="w-5 h-5 text-red-500" />
                                                <AlertCircle v-else-if="viesStatus === 'error'" class="w-5 h-5 text-amber-500" />
                                            </div>
                                        </div>
                                        <p v-if="viesStatus === 'invalid' && viesError" class="mt-1.5 text-[11px] text-red-600">
                                            {{ viesError }}
                                        </p>
                                        <p v-if="viesStatus === 'error' && viesError" class="mt-1.5 text-[11px] text-amber-600">
                                            {{ viesError }}
                                        </p>
                                    </div>

                                    <!-- 2. Názov spoločnosti — auto-fill z VIES -->
                                    <div>
                                        <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                                            Názov spoločnosti *
                                            <span v-if="viesStatus === 'valid' && viesCompanyName" class="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1">
                                                <ShieldCheck class="w-3 h-3" /> z VIES
                                            </span>
                                        </label>
                                        <input v-model="form.company" type="text" :required="form.isCompany" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" />
                                    </div>

                                    <!-- 3. IČO + DIČ -->
                                    <div class="grid grid-cols-2 gap-4">
                                        <div class="col-span-2 sm:col-span-1">
                                            <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">IČO *</label>
                                            <input v-model="form.ico" type="text" :required="form.isCompany" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" />
                                        </div>
                                        <div class="col-span-2 sm:col-span-1">
                                            <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">DIČ</label>
                                            <input v-model="form.dic" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4 mt-6">
                                <h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Doručovacia adresa</h3>
                                
                                <div class="col-span-2">
                                    <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Ulica a číslo *</label>
                                    <input v-model="form.street" type="text" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" />
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">PSČ *</label>
                                        <input v-model="form.zipcode" type="text" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Mesto *</label>
                                        <input v-model="form.city" type="text" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" />
                                    </div>
                                </div>
                                <div class="col-span-2">
                                    <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Krajina *</label>
                                    <select v-model="form.countryId" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors">
                                        <option v-for="c in getCountries" :key="c.id" :value="c.id">{{ c.translated?.name || c.name || 'Neznáma krajina' }}</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>

                    <!-- Footer so submit tlačidlom prepojeným na form -->
                    <div class="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">
                        <button type="submit" form="address-form" :disabled="isSaving" class="w-full h-14 bg-brand text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-brand-dark transition-colors flex items-center justify-center">
                            <Loader2 v-if="isSaving" class="w-5 h-5 animate-spin mr-2" />
                            <span v-if="!isSaving">{{ isEditing ? 'Uložiť zmeny' : 'Pridať adresu' }}</span>
                        </button>
                    </div>

                </div>
            </div>
        </Teleport>

    </div>
</template>

<style scoped>
.animate-slide-in-right {
    animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
}
</style>
