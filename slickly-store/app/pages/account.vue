<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { User, Package, MapPin, LogOut, Settings, ChevronRight, Search, RotateCcw, Gift, Heart, Loader2, Bookmark, Upload, Scale } from 'lucide-vue-next';
// @ts-ignore
import { useUser, useCustomerOrders, useAddress, useSessionContext } from '@shopware/composables';
import { useCustomerWishlist } from '~/composables/useCustomerWishlist';
import { useLoyalty } from '~/composables/useLoyalty';

definePageMeta({ middleware: 'auth' });

useHead({
    title: 'Môj účet - SLICKLY'
});

const { user, isLoggedIn, logout } = useUser();
const { refreshSessionContext } = useSessionContext();

if (!isLoggedIn.value) await navigateTo('/');

const { orders, loadOrders } = useCustomerOrders();
await loadOrders({ 
    limit: 10,
    associations: {
        lineItems: {
            associations: {
                cover: {},
                product: {
                    associations: { cover: {} }
                }
            }
        },
        stateMachineState: {},
        deliveries: {
            associations: {
                shippingMethod: {},
                stateMachineState: {}
            }
        },
        transactions: {
            associations: {
                paymentMethod: {},
                stateMachineState: {}
            }
        }
    }
});

const { customerAddresses, loadCustomerAddresses } = useAddress();
await loadCustomerAddresses();

const { wishlistItems, loadWishlist, toggleWishlist } = useCustomerWishlist();

type Tab = 'prehled' | 'oblubene' | 'objednavky' | 'sledovanie' | 'adresy' | 'reklamacie' | 'vernostne' | 'profil' | 'ulozeny-kosik' | 'porovnania';
const activeTab = ref<Tab>('prehled');
const isLoggingOut = ref(false);

watch(activeTab, () => {
    nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

const navItems: Array<{ id: Tab; label: string; icon: any }> = [
    { id: 'prehled',    label: 'Prehľad',               icon: User },
    { id: 'oblubene',   label: 'Moje Obľúbené',         icon: Heart },
    { id: 'objednavky', label: 'Moje objednávky',       icon: Package },
    { id: 'sledovanie', label: 'Sledovanie objednávky', icon: Search },
    { id: 'adresy',     label: 'Adresy',                icon: MapPin },
    { id: 'reklamacie', label: 'Reklamácie a vrátenie', icon: RotateCcw },
    { id: 'vernostne',  label: 'Vernostné body',        icon: Gift },
    { id: 'ulozeny-kosik', label: 'Uložený košík',       icon: Bookmark },
    { id: 'porovnania',   label: 'Porovnania',          icon: Scale },
    { id: 'profil',        label: 'Nastavenia profilu',  icon: Settings },
];

const { summary: loyaltySummary, fetchSummary: fetchLoyaltySummary } = useLoyalty();
const loyaltyPoints = computed(() => loyaltySummary.value?.availablePoints ?? 0);
const totalSpent = computed(() => {
    let total = 0;
    orders.value?.forEach((o: any) => { total += o.amountTotal || 0; });
    return total;
});

const recentlyViewed = ref<{ id: string; name: string; image: string }[]>([]);

onMounted(() => {
    loadWishlist();
    fetchLoyaltySummary();
    const raw = localStorage.getItem('recently_viewed');
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) { recentlyViewed.value = parsed; }
        } catch (e) {
            console.error('Failed to parse recently_viewed from localStorage', e);
        }
    }
});

async function handleLogout() {
    isLoggingOut.value = true;
    try { await logout(); await refreshSessionContext(); await navigateTo('/'); }
    finally { isLoggingOut.value = false; }
}

const handleRemoveFromWishlist = async (id: string, name: string) => {
    await toggleWishlist(id);
    const toast = useState('wishlistToast', () => ({ show: false, productName: '', action: 'add' as 'add' | 'remove' }));
    toast.value = { show: true, productName: name, action: 'remove' };
};

const displayName = computed(() => {
    if (user.value?.firstName) return `${user.value.firstName} ${user.value.lastName || ''}`.trim();
    return user.value?.email || 'Hosť';
});

const predefinedAvatars = [
    'https://api.dicebear.com/7.x/shapes/svg?seed=MTS1&backgroundColor=f9fafb',
    'https://api.dicebear.com/7.x/shapes/svg?seed=MTS6&backgroundColor=f9fafb',
    'https://api.dicebear.com/7.x/bottts/svg?seed=MTS2&backgroundColor=f9fafb',
    'https://api.dicebear.com/7.x/bottts/svg?seed=MTS7&backgroundColor=f9fafb',
    'https://api.dicebear.com/7.x/identicon/svg?seed=MTS3&backgroundColor=f9fafb',
    'https://api.dicebear.com/7.x/identicon/svg?seed=MTS8&backgroundColor=f9fafb',
    'https://api.dicebear.com/7.x/rings/svg?seed=MTS4&backgroundColor=f9fafb',
    'https://api.dicebear.com/7.x/rings/svg?seed=MTS9&backgroundColor=f9fafb',
    'https://api.dicebear.com/7.x/initials/svg?seed=MT&backgroundColor=f9fafb',
    'https://api.dicebear.com/7.x/initials/svg?seed=RIDE&backgroundColor=f9fafb'
];
const currentAvatar = ref('');
const showAvatarModal = ref(false);

onMounted(() => {
    // Prioritizujeme manuálne uložený avatar (ak si používateľ nejaký vybral)
    const saved = localStorage.getItem('user_avatar');
    
    // FB/Google avatar url z custom fields
    const socialAvatar = user.value?.customFields?.avatar_url || user.value?.customFields?.social_avatar;

    if (saved) {
        currentAvatar.value = saved;
    } else if (socialAvatar) {
        currentAvatar.value = socialAvatar;
    } else {
        currentAvatar.value = predefinedAvatars[0];
    }
});

const selectAvatar = (url: string) => {
    currentAvatar.value = url;
    localStorage.setItem('user_avatar', url);
};

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileUpload = () => {
    fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    
    const file = target.files[0];
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Nepodporovaný formát. Použite JPG, PNG alebo WEBP.');
        return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
        alert('Súbor je príliš veľký. Maximálna povolená veľkosť je 2MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
            selectAvatar(result);
            showAvatarModal.value = false;
        }
    };
    reader.readAsDataURL(file);
};
</script>

<template>
    <div class="min-h-screen bg-[#fafafa] font-sans">
        <div class="container mx-auto px-4 lg:px-8 py-10 lg:py-16">

            <!-- Page Header -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6">
                <div>
                    <h1 class="text-3xl md:text-5xl font-black uppercase font-tech tracking-wide text-black italic">
                        MÔJ <span class="text-brand">ÚČET</span>
                    </h1>
                    <p class="text-gray-600 text-sm mt-2 font-sans font-medium">
                        Vitajte späť, <span class="font-bold text-black">{{ displayName }}</span>
                    </p>
                </div>
                <button @click="handleLogout" class="flex items-center gap-2 mt-4 md:mt-0 px-5 py-2.5 border border-brand text-[11px] font-bold uppercase tracking-widest text-brand hover:bg-brand hover:text-white transition-all duration-300">
                    <Loader2 v-if="isLoggingOut" class="w-4 h-4 animate-spin" />
                    <LogOut v-else class="w-4 h-4" />
                    Odhlásiť sa
                </button>
            </div>

            <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

                <!-- Sidebar -->
                <aside class="w-full lg:w-80 flex-shrink-0 bg-white shadow-sm sticky top-24">
                    <div class="p-6 border-b border-gray-100 flex items-center gap-4 relative">
                        <div class="relative w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-black font-black text-xl flex-shrink-0 cursor-pointer group" @click="showAvatarModal = !showAvatarModal">
                            <div class="w-full h-full overflow-hidden rounded-full">
                                <img :src="currentAvatar" alt="avatar" class="w-full h-full object-cover transition-all group-hover:brightness-75" />
                            </div>
                            <div class="absolute inset-0 hidden group-hover:flex items-center justify-center pointer-events-none rounded-full">
                                <Settings class="w-5 h-5 text-white drop-shadow-md" />
                            </div>
                        </div>
                        <div class="min-w-0">
                            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Účet</p>
                            <p class="text-xs font-bold text-black truncate">{{ displayName }}</p>
                        </div>
                        
                        <!-- Modal pre avatary -->
                        <div v-if="showAvatarModal" class="absolute top-24 left-6 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-6 z-50 animate-fade-in flex flex-col gap-6 w-[340px] rounded-none">
                            
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Vyberte si avatara z knižnice</p>
                                <div class="grid grid-cols-5 gap-3">
                                    <button v-for="av in predefinedAvatars" :key="av" @click="selectAvatar(av); showAvatarModal = false" class="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-[3px] transition-all" :class="currentAvatar === av ? 'border-brand shadow-lg scale-110' : 'border-transparent hover:border-gray-200 hover:scale-105'">
                                        <img :src="av" class="w-full h-full object-cover" />
                                    </button>
                                </div>
                            </div>
                            
                            <div class="border-t border-gray-100 pt-5">
                                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Alebo nahrajte vlastnú fotku</p>
                                
                                <input type="file" ref="fileInput" accept="image/jpeg, image/png, image/webp" class="hidden" @change="handleFileUpload" />
                                
                                <button @click="triggerFileUpload" class="w-full py-3 bg-gray-50 border border-gray-200 text-[11px] font-bold text-black uppercase tracking-widest hover:border-brand hover:bg-brand hover:text-white transition-colors flex items-center justify-center gap-2">
                                    <Upload class="w-4 h-4" /> Nahrať obrázok
                                </button>
                                
                                <div class="mt-4 text-[10px] text-gray-400 font-sans leading-relaxed">
                                    <p><strong>Formát:</strong> JPG, PNG, WEBP</p>
                                    <p><strong>Rozmer:</strong> odporúčaný 250 x 250 px</p>
                                    <p><strong>Veľkosť:</strong> max. 2 MB</p>
                                </div>
                            </div>

                            <button @click="showAvatarModal = false" class="text-[10px] font-bold text-gray-400 hover:text-black uppercase self-end transition-colors mt-2">Zavrieť</button>
                        </div>
                    </div>
                    <nav class="py-2">
                        <button v-for="item in navItems" :key="item.id" @click="activeTab = item.id" class="w-full flex items-center justify-between px-6 py-[18px] text-[11px] font-bold uppercase tracking-widest transition-all duration-200 text-left" :class="activeTab === item.id ? 'bg-black text-white px-[20px] border-l-4 border-l-brand' : 'text-gray-600 hover:text-black hover:bg-gray-50'">
                            <div class="flex items-center gap-4 flex-1 pr-2">
                                <component :is="item.icon" class="w-4 h-4 flex-shrink-0 transition-colors" :class="activeTab === item.id ? 'text-brand' : 'text-gray-400'" />
                                <span class="leading-tight">{{ item.label }}</span>
                            </div>
                            <ChevronRight class="w-3.5 h-3.5 flex-shrink-0 transition-transform" :class="activeTab === item.id ? 'translate-x-1 text-white' : 'text-gray-300'" />
                        </button>
                    </nav>
                </aside>

                <!-- Main Content -->
                <main class="flex-1 min-w-0 w-full">
                    <AccountTabPrehled v-if="activeTab === 'prehled'" :user="user" :orders="orders || []" :recently-viewed="recentlyViewed" :loyalty-points="loyaltyPoints" :total-spent="totalSpent" @change-tab="activeTab = $event as Tab" />
                    <AccountTabOblubene v-else-if="activeTab === 'oblubene'" :wishlist-items="wishlistItems || []" @remove="handleRemoveFromWishlist" />
                    <AccountTabObjednavky v-else-if="activeTab === 'objednavky'" :orders="orders || []" />
                    <AccountTabSledovanie v-else-if="activeTab === 'sledovanie'" />
                    <AccountTabAdresy v-else-if="activeTab === 'adresy'" :customer-addresses="customerAddresses || []" :user="user" @refresh="loadCustomerAddresses" />
                    <AccountTabReklamacie v-else-if="activeTab === 'reklamacie'" />
                    <AccountTabVernostne v-else-if="activeTab === 'vernostne'" />
                    <AccountTabUlozenKosik v-else-if="activeTab === 'ulozeny-kosik'" />
                    <AccountTabPorovnania v-else-if="activeTab === 'porovnania'" />
                    <AccountTabProfil v-else-if="activeTab === 'profil'" :user="user" :current-avatar="currentAvatar" @open-avatar-modal="showAvatarModal = true" />
                </main>

            </div>
        </div>
    </div>
</template>
