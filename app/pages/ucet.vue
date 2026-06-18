<script setup lang="ts">
const { formatPrice } = useCurrency()
const route = useRoute()
const router = useRouter()
const wishlist = useWishlistStore()

useSeo({
  title: 'Môj účet | SLICKLY',
  description: 'Spravujte svoj účet SLICKLY — objednávky, adresy, nastavenia a reklamácie.',
  noindex: true,
})

type Tab = 'prehlad' | 'objednavky' | 'adresy' | 'nastavenia' | 'reklamacie'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'prehlad', label: 'Prehľad', icon: 'dashboard' },
  { id: 'objednavky', label: 'Objednávky', icon: 'receipt_long' },
  { id: 'adresy', label: 'Adresy', icon: 'location_on' },
  { id: 'nastavenia', label: 'Nastavenia', icon: 'settings' },
  { id: 'reklamacie', label: 'Reklamácie', icon: 'assignment_return' },
]

const activeTab = computed<Tab>({
  get: () => {
    const q = route.query.tab as string
    return tabs.some((t) => t.id === q) ? (q as Tab) : 'prehlad'
  },
  set: (val: Tab) => {
    router.replace({ query: { tab: val } })
  },
})

// ── Mock user ──
const user = reactive({
  firstName: 'Jakub',
  lastName: 'Zjavka',
  email: 'zjavka.jakub@gmail.com',
  phone: '+421 911 222 333',
  newsletter: true,
})

// ── Mock orders ──
interface MockOrderItem {
  name: string
  sku: string
  price: number
  quantity: number
  image: string
  slug: string
}

interface MockOrder {
  id: string
  date: string
  status: 'dorucena' | 'odoslana' | 'spracovava-sa' | 'zrusena'
  statusLabel: string
  total: number
  items: MockOrderItem[]
  address: string
  tracking?: string
}

const mockOrders: MockOrder[] = [
  {
    id: 'SL-20261847',
    date: '12. 6. 2026',
    status: 'odoslana',
    statusLabel: 'Odoslaná',
    total: 87.90,
    items: [
      { name: 'Ceramic Shield V2', sku: 'PRD-01', price: 49.00, quantity: 1, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFeLCzCRH0LSuRZZu7vq8EHmh_ZfKZs3lRqMinCgY-t2nvPamXbDW-1QesEYqoWglhm7f5oTyetNLtG5GM-QQ3u17QuFBhMwa1R5N2q6PLc_Lz9qkNXBkBQHALmYdPeSHCIqJ5QJHHOe2WBXsK9vwgao5BBw9NCbIRhAJsGyca6_iZq-Ewn_Nnsl__qtJdGieJoqtUW2Gs8pTHof_-c4dqu0vnJdJaYL_kj4BaSV5cDxxUcHefEGTGYnRVqE5z9ZDayG3icxAbwxLu', slug: 'ceramic-shield-v2' },
      { name: 'Hydro Gloss Detail', sku: 'PRD-02', price: 19.90, quantity: 2, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqfvgYp-kJav9gkqgmOCsYjiC4So4GJqBaDdrvshiS8mq5C6hkxkm8oDWK8B-dGiOWMMRwf3BBR-0y0ESfGIzvVIhANKwAwABI0mCNdZbAssr5124Ae98epxLYqYIaO-JIQXTvYiTIW0FqIxbg7U-S4yrZ28DWrgYXb68xQU4qAloA0KW2BiiZdT2l71fQqWHagcpUhDZlDbnCsNuLaB1sGiwQuPu9yxPGK_itWLZ-xAnbUba8N0PptKYneergNR78yuNGghEppTOZ', slug: 'hydro-gloss-detail' },
    ],
    address: 'Jakub Zjavka, Hlavná 42, 831 01 Bratislava',
    tracking: 'GLS-SK-9281736450',
  },
  {
    id: 'SL-20261523',
    date: '28. 5. 2026',
    status: 'dorucena',
    statusLabel: 'Doručená',
    total: 34.90,
    items: [
      { name: 'Paint Correction Polish', sku: 'PRD-03', price: 34.90, quantity: 1, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFeLCzCRH0LSuRZZu7vq8EHmh_ZfKZs3lRqMinCgY-t2nvPamXbDW-1QesEYqoWglhm7f5oTyetNLtG5GM-QQ3u17QuFBhMwa1R5N2q6PLc_Lz9qkNXBkBQHALmYdPeSHCIqJ5QJHHOe2WBXsK9vwgao5BBw9NCbIRhAJsGyca6_iZq-Ewn_Nnsl__qtJdGieJoqtUW2Gs8pTHof_-c4dqu0vnJdJaYL_kj4BaSV5cDxxUcHefEGTGYnRVqE5z9ZDayG3icxAbwxLu', slug: 'ceramic-shield-v2' },
    ],
    address: 'Jakub Zjavka, Hlavná 42, 831 01 Bratislava',
  },
  {
    id: 'SL-20261201',
    date: '3. 5. 2026',
    status: 'spracovava-sa',
    statusLabel: 'Spracováva sa',
    total: 129.70,
    items: [
      { name: 'Ceramic Shield V2', sku: 'PRD-01', price: 49.00, quantity: 2, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFeLCzCRH0LSuRZZu7vq8EHmh_ZfKZs3lRqMinCgY-t2nvPamXbDW-1QesEYqoWglhm7f5oTyetNLtG5GM-QQ3u17QuFBhMwa1R5N2q6PLc_Lz9qkNXBkBQHALmYdPeSHCIqJ5QJHHOe2WBXsK9vwgao5BBw9NCbIRhAJsGyca6_iZq-Ewn_Nnsl__qtJdGieJoqtUW2Gs8pTHof_-c4dqu0vnJdJaYL_kj4BaSV5cDxxUcHefEGTGYnRVqE5z9ZDayG3icxAbwxLu', slug: 'ceramic-shield-v2' },
      { name: 'Hydro Gloss Detail', sku: 'PRD-02', price: 19.90, quantity: 1, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqfvgYp-kJav9gkqgmOCsYjiC4So4GJqBaDdrvshiS8mq5C6hkxkm8oDWK8B-dGiOWMMRwf3BBR-0y0ESfGIzvVIhANKwAwABI0mCNdZbAssr5124Ae98epxLYqYIaO-JIQXTvYiTIW0FqIxbg7U-S4yrZ28DWrgYXb68xQU4qAloA0KW2BiiZdT2l71fQqWHagcpUhDZlDbnCsNuLaB1sGiwQuPu9yxPGK_itWLZ-xAnbUba8N0PptKYneergNR78yuNGghEppTOZ', slug: 'hydro-gloss-detail' },
      { name: 'Interior Detailer Pro', sku: 'PRD-05', price: 11.80, quantity: 1, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFeLCzCRH0LSuRZZu7vq8EHmh_ZfKZs3lRqMinCgY-t2nvPamXbDW-1QesEYqoWglhm7f5oTyetNLtG5GM-QQ3u17QuFBhMwa1R5N2q6PLc_Lz9qkNXBkBQHALmYdPeSHCIqJ5QJHHOe2WBXsK9vwgao5BBw9NCbIRhAJsGyca6_iZq-Ewn_Nnsl__qtJdGieJoqtUW2Gs8pTHof_-c4dqu0vnJdJaYL_kj4BaSV5cDxxUcHefEGTGYnRVqE5z9ZDayG3icxAbwxLu', slug: 'ceramic-shield-v2' },
    ],
    address: 'Jakub Zjavka, Kollárova 8, 917 01 Trnava',
  },
  {
    id: 'SL-20260987',
    date: '14. 3. 2026',
    status: 'zrusena',
    statusLabel: 'Zrušená',
    total: 49.00,
    items: [
      { name: 'Ceramic Shield V2', sku: 'PRD-01', price: 49.00, quantity: 1, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFeLCzCRH0LSuRZZu7vq8EHmh_ZfKZs3lRqMinCgY-t2nvPamXbDW-1QesEYqoWglhm7f5oTyetNLtG5GM-QQ3u17QuFBhMwa1R5N2q6PLc_Lz9qkNXBkBQHALmYdPeSHCIqJ5QJHHOe2WBXsK9vwgao5BBw9NCbIRhAJsGyca6_iZq-Ewn_Nnsl__qtJdGieJoqtUW2Gs8pTHof_-c4dqu0vnJdJaYL_kj4BaSV5cDxxUcHefEGTGYnRVqE5z9ZDayG3icxAbwxLu', slug: 'ceramic-shield-v2' },
    ],
    address: 'Jakub Zjavka, Hlavná 42, 831 01 Bratislava',
  },
  {
    id: 'SL-20260754',
    date: '2. 2. 2026',
    status: 'dorucena',
    statusLabel: 'Doručená',
    total: 69.80,
    items: [
      { name: 'Hydro Gloss Detail', sku: 'PRD-02', price: 19.90, quantity: 2, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqfvgYp-kJav9gkqgmOCsYjiC4So4GJqBaDdrvshiS8mq5C6hkxkm8oDWK8B-dGiOWMMRwf3BBR-0y0ESfGIzvVIhANKwAwABI0mCNdZbAssr5124Ae98epxLYqYIaO-JIQXTvYiTIW0FqIxbg7U-S4yrZ28DWrgYXb68xQU4qAloA0KW2BiiZdT2l71fQqWHagcpUhDZlDbnCsNuLaB1sGiwQuPu9yxPGK_itWLZ-xAnbUba8N0PptKYneergNR78yuNGghEppTOZ', slug: 'hydro-gloss-detail' },
      { name: 'Paint Correction Polish', sku: 'PRD-03', price: 34.90, quantity: 1, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFeLCzCRH0LSuRZZu7vq8EHmh_ZfKZs3lRqMinCgY-t2nvPamXbDW-1QesEYqoWglhm7f5oTyetNLtG5GM-QQ3u17QuFBhMwa1R5N2q6PLc_Lz9qkNXBkBQHALmYdPeSHCIqJ5QJHHOe2WBXsK9vwgao5BBw9NCbIRhAJsGyca6_iZq-Ewn_Nnsl__qtJdGieJoqtUW2Gs8pTHof_-c4dqu0vnJdJaYL_kj4BaSV5cDxxUcHefEGTGYnRVqE5z9ZDayG3icxAbwxLu', slug: 'ceramic-shield-v2' },
    ],
    address: 'Jakub Zjavka, Hlavná 42, 831 01 Bratislava',
  },
]

const expandedOrder = ref<string | null>(null)
function toggleOrder(id: string) {
  expandedOrder.value = expandedOrder.value === id ? null : id
}

function statusColor(status: MockOrder['status']) {
  switch (status) {
    case 'dorucena': return 'bg-green-100 text-green-800'
    case 'odoslana': return 'bg-blue-100 text-blue-800'
    case 'spracovava-sa': return 'bg-amber-100 text-amber-800'
    case 'zrusena': return 'bg-red-100 text-red-800'
  }
}

// ── Mock addresses ──
interface MockAddress {
  id: string
  name: string
  street: string
  city: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

const addresses = ref<MockAddress[]>([
  { id: 'addr-1', name: 'Jakub Zjavka', street: 'Hlavná 42', city: 'Bratislava', postalCode: '831 01', country: 'Slovensko', phone: '+421 911 222 333', isDefault: true },
  { id: 'addr-2', name: 'Jakub Zjavka', street: 'Kollárova 8', city: 'Trnava', postalCode: '917 01', country: 'Slovensko', phone: '+421 911 222 333', isDefault: false },
  { id: 'addr-3', name: 'Jana Zjavková', street: 'Štefánikova 15', city: 'Nitra', postalCode: '949 01', country: 'Slovensko', phone: '+421 902 444 555', isDefault: false },
])

const addressForm = reactive({
  visible: false,
  editId: null as string | null,
  name: '',
  street: '',
  city: '',
  postalCode: '',
  country: 'Slovensko',
  phone: '',
})

const addressSaving = ref(false)
const addressSuccess = ref(false)

function openAddAddress() {
  addressForm.visible = true
  addressForm.editId = null
  addressForm.name = ''
  addressForm.street = ''
  addressForm.city = ''
  addressForm.postalCode = ''
  addressForm.country = 'Slovensko'
  addressForm.phone = ''
}

function openEditAddress(addr: MockAddress) {
  addressForm.visible = true
  addressForm.editId = addr.id
  addressForm.name = addr.name
  addressForm.street = addr.street
  addressForm.city = addr.city
  addressForm.postalCode = addr.postalCode
  addressForm.country = addr.country
  addressForm.phone = addr.phone
}

function cancelAddressForm() {
  addressForm.visible = false
}

async function saveAddress() {
  addressSaving.value = true
  await new Promise((r) => setTimeout(r, 600))
  if (addressForm.editId) {
    const idx = addresses.value.findIndex((a) => a.id === addressForm.editId)
    if (idx !== -1) {
      addresses.value[idx] = {
        ...addresses.value[idx]!,
        name: addressForm.name,
        street: addressForm.street,
        city: addressForm.city,
        postalCode: addressForm.postalCode,
        country: addressForm.country,
        phone: addressForm.phone,
      }
    }
  } else {
    addresses.value.push({
      id: `addr-${Date.now()}`,
      name: addressForm.name,
      street: addressForm.street,
      city: addressForm.city,
      postalCode: addressForm.postalCode,
      country: addressForm.country,
      phone: addressForm.phone,
      isDefault: false,
    })
  }
  addressSaving.value = false
  addressSuccess.value = true
  setTimeout(() => { addressSuccess.value = false }, 2000)
  addressForm.visible = false
}

const deleteConfirmId = ref<string | null>(null)

function confirmDeleteAddress(id: string) {
  deleteConfirmId.value = id
}

function cancelDelete() {
  deleteConfirmId.value = null
}

function deleteAddress(id: string) {
  addresses.value = addresses.value.filter((a) => a.id !== id)
  deleteConfirmId.value = null
}

function setDefaultAddress(id: string) {
  addresses.value.forEach((a) => { a.isDefault = a.id === id })
}

// ── Settings ──
const settingsForm = reactive({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
})

const passwordForm = reactive({
  current: '',
  newPass: '',
  confirm: '',
})

const settingsSaving = ref(false)
const settingsSuccess = ref(false)
const passwordSaving = ref(false)
const passwordSuccess = ref(false)
const passwordError = ref('')
const deleteAccountConfirm = ref(false)

async function saveSettings() {
  settingsSaving.value = true
  await new Promise((r) => setTimeout(r, 600))
  user.firstName = settingsForm.firstName
  user.lastName = settingsForm.lastName
  user.email = settingsForm.email
  user.phone = settingsForm.phone
  settingsSaving.value = false
  settingsSuccess.value = true
  setTimeout(() => { settingsSuccess.value = false }, 2000)
}

async function changePassword() {
  passwordError.value = ''
  if (passwordForm.newPass !== passwordForm.confirm) {
    passwordError.value = 'Heslá sa nezhodujú.'
    return
  }
  if (passwordForm.newPass.length < 8) {
    passwordError.value = 'Heslo musí mať aspoň 8 znakov.'
    return
  }
  passwordSaving.value = true
  await new Promise((r) => setTimeout(r, 600))
  passwordSaving.value = false
  passwordSuccess.value = true
  passwordForm.current = ''
  passwordForm.newPass = ''
  passwordForm.confirm = ''
  setTimeout(() => { passwordSuccess.value = false }, 2000)
}

// ── Mock claims ──
interface MockClaim {
  id: string
  orderId: string
  itemName: string
  reason: string
  description: string
  status: 'prijata' | 'posudzuje-sa' | 'schvalena' | 'zamietnuta'
  statusLabel: string
  date: string
}

const claims = ref<MockClaim[]>([
  { id: 'CLM-001', orderId: 'SL-20261523', itemName: 'Paint Correction Polish', reason: 'Poškodený obal', description: 'Produkt prišiel s prasknutým uzáverom, časť obsahu vytiekla.', status: 'posudzuje-sa', statusLabel: 'Posudzuje sa', date: '5. 6. 2026' },
  { id: 'CLM-002', orderId: 'SL-20260754', itemName: 'Hydro Gloss Detail', reason: 'Nesprávny produkt', description: 'Bol doručený iný produkt ako som objednal.', status: 'schvalena', statusLabel: 'Schválená', date: '20. 2. 2026' },
])

function claimStatusColor(status: MockClaim['status']) {
  switch (status) {
    case 'prijata': return 'bg-blue-100 text-blue-800'
    case 'posudzuje-sa': return 'bg-amber-100 text-amber-800'
    case 'schvalena': return 'bg-green-100 text-green-800'
    case 'zamietnuta': return 'bg-red-100 text-red-800'
  }
}

const claimForm = reactive({
  visible: false,
  orderId: '',
  itemName: '',
  reason: '',
  description: '',
})

const claimSaving = ref(false)
const claimSuccess = ref(false)

const claimReasons = [
  'Poškodený obal',
  'Nesprávny produkt',
  'Chýbajúci produkt',
  'Nekvalitný produkt',
  'Iné',
]

// Only delivered orders can have claims filed
const claimableOrders = computed(() => mockOrders.filter((o) => o.status === 'dorucena'))

const claimableItems = computed(() => {
  const order = mockOrders.find((o) => o.id === claimForm.orderId)
  return order?.items ?? []
})

function openNewClaim() {
  claimForm.visible = true
  claimForm.orderId = ''
  claimForm.itemName = ''
  claimForm.reason = ''
  claimForm.description = ''
}

async function submitClaim() {
  claimSaving.value = true
  await new Promise((r) => setTimeout(r, 600))
  claims.value.unshift({
    id: `CLM-${String(claims.value.length + 1).padStart(3, '0')}`,
    orderId: claimForm.orderId,
    itemName: claimForm.itemName,
    reason: claimForm.reason,
    description: claimForm.description,
    status: 'prijata',
    statusLabel: 'Prijatá',
    date: new Date().toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' }),
  })
  claimSaving.value = false
  claimSuccess.value = true
  setTimeout(() => { claimSuccess.value = false }, 2000)
  claimForm.visible = false
}

// ── Overview computed ──
const recentOrders = computed(() => mockOrders.slice(0, 3))
const deliveredCount = computed(() => mockOrders.filter((o) => o.status === 'dorucena').length)
</script>

<template>
  <div
    class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin py-stack-lg md:py-12 pb-28 md:pb-12"
  >
    <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant block mb-stack-lg md:mb-8">
      <NuxtLink to="/" class="hover:text-on-background">Domov</NuxtLink> / Účet
    </span>

    <div class="flex flex-col md:flex-row gap-stack-lg md:gap-12">
      <!-- Desktop sidebar -->
      <aside class="hidden md:flex flex-col gap-stack-xs w-64 shrink-0">
        <h1 class="font-headline-lg text-headline-lg uppercase mb-stack-sm">Môj účet</h1>
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="flex items-center gap-stack-sm min-h-11 px-4 py-2 rounded-default cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="activeTab === tab.id ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-background'"
          @click="activeTab = tab.id"
        >
          <span class="material-symbols-outlined text-[20px]" aria-hidden="true">{{ tab.icon }}</span>
          <span class="font-label-sm text-label-sm uppercase tracking-widest">{{ tab.label }}</span>
        </button>
      </aside>

      <!-- Mobile tab chips -->
      <div class="md:hidden">
        <h1 class="font-headline-lg text-headline-lg uppercase mb-stack-md">Môj účet</h1>
        <nav class="flex gap-stack-sm overflow-x-auto hide-scrollbar -mx-gutter px-gutter pb-stack-sm" aria-label="Navigácia účtu">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="flex items-center gap-1.5 min-h-11 px-4 py-2 rounded-full whitespace-nowrap shrink-0 cursor-pointer [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :class="activeTab === tab.id ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface-variant'"
            @click="activeTab = tab.id"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">{{ tab.icon }}</span>
            <span class="font-label-sm text-label-sm uppercase tracking-widest">{{ tab.label }}</span>
          </button>
        </nav>
      </div>

      <!-- Tab content -->
      <div class="flex-grow min-w-0">

        <!-- ════════ PREHLAD ════════ -->
        <section v-if="activeTab === 'prehlad'" class="flex flex-col gap-stack-lg">
          <div class="flex items-center gap-stack-md">
            <div class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface-container flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[32px] md:text-[40px] text-on-surface-variant" aria-hidden="true">person</span>
            </div>
            <div>
              <h2 class="font-headline-md text-headline-md uppercase">{{ user.firstName }} {{ user.lastName }}</h2>
              <p class="font-technical-data text-technical-data text-on-surface-variant uppercase">{{ user.email }}</p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-stack-sm md:gap-stack-md">
            <div class="border border-grid-line p-stack-sm md:p-stack-md rounded-default text-center">
              <span class="font-headline-md text-headline-md block">{{ mockOrders.length }}</span>
              <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Objednávky</span>
            </div>
            <div class="border border-grid-line p-stack-sm md:p-stack-md rounded-default text-center">
              <span class="font-headline-md text-headline-md block">{{ addresses.length }}</span>
              <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Adresy</span>
            </div>
            <ClientOnly>
              <div class="border border-grid-line p-stack-sm md:p-stack-md rounded-default text-center">
                <span class="font-headline-md text-headline-md block">{{ wishlist.count }}</span>
                <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Obľúbené</span>
              </div>
              <template #fallback>
                <div class="border border-grid-line p-stack-sm md:p-stack-md rounded-default text-center">
                  <span class="font-headline-md text-headline-md block">--</span>
                  <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Obľúbené</span>
                </div>
              </template>
            </ClientOnly>
          </div>

          <div>
            <h3 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm mb-stack-md">
              Posledné objednávky
            </h3>
            <div class="flex flex-col divide-y divide-grid-line">
              <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between gap-stack-sm py-stack-sm">
                <div class="flex items-center gap-stack-sm min-w-0">
                  <div class="w-10 h-10 bg-surface-container-lowest border border-grid-line overflow-hidden rounded-default shrink-0">
                    <img :src="order.items[0]!.image" :alt="order.items[0]!.name" loading="lazy" class="w-full h-full object-cover" />
                  </div>
                  <div class="min-w-0">
                    <p class="font-body-md text-body-md truncate">{{ order.id }}</p>
                    <p class="font-technical-data text-technical-data text-on-surface-variant uppercase">{{ order.date }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-stack-sm shrink-0">
                  <span
                    class="px-2 py-0.5 rounded-full font-technical-data text-technical-data uppercase"
                    :class="statusColor(order.status)"
                  >{{ order.statusLabel }}</span>
                  <span class="font-price-display text-price-display">{{ formatPrice(order.total) }}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              class="mt-stack-sm font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              @click="activeTab = 'objednavky'"
            >
              Zobraziť všetky objednávky
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-stack-sm md:gap-stack-md">
            <button
              type="button"
              class="flex items-center gap-stack-sm border border-grid-line p-stack-md rounded-default cursor-pointer transition-colors duration-200 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-11"
              @click="activeTab = 'objednavky'"
            >
              <span class="material-symbols-outlined text-[24px] text-on-surface-variant" aria-hidden="true">shopping_bag</span>
              <div class="text-left">
                <span class="font-body-md text-body-md block">Nová objednávka</span>
                <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Prehľad objednávok</span>
              </div>
            </button>
            <button
              type="button"
              class="flex items-center gap-stack-sm border border-grid-line p-stack-md rounded-default cursor-pointer transition-colors duration-200 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-11"
              @click="activeTab = 'adresy'"
            >
              <span class="material-symbols-outlined text-[24px] text-on-surface-variant" aria-hidden="true">edit_location_alt</span>
              <div class="text-left">
                <span class="font-body-md text-body-md block">Upraviť adresu</span>
                <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Správa adries</span>
              </div>
            </button>
            <button
              type="button"
              class="flex items-center gap-stack-sm border border-grid-line p-stack-md rounded-default cursor-pointer transition-colors duration-200 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-11"
              @click="activeTab = 'nastavenia'"
            >
              <span class="material-symbols-outlined text-[24px] text-on-surface-variant" aria-hidden="true">manage_accounts</span>
              <div class="text-left">
                <span class="font-body-md text-body-md block">Nastavenia účtu</span>
                <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Osobné údaje</span>
              </div>
            </button>
          </div>
        </section>

        <!-- ════════ OBJEDNAVKY ════════ -->
        <section v-if="activeTab === 'objednavky'" class="flex flex-col gap-stack-md">
          <h2 class="font-headline-md text-headline-md uppercase">História objednávok</h2>

          <div class="flex flex-col border-y border-grid-line divide-y divide-grid-line">
            <div v-for="order in mockOrders" :key="order.id">
              <button
                type="button"
                class="w-full flex items-center justify-between gap-stack-sm py-stack-md cursor-pointer [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-11"
                :aria-expanded="expandedOrder === order.id"
                @click="toggleOrder(order.id)"
              >
                <div class="flex items-center gap-stack-sm min-w-0">
                  <div class="flex -space-x-2 shrink-0">
                    <div
                      v-for="(item, idx) in order.items.slice(0, 3)"
                      :key="idx"
                      class="w-10 h-10 bg-surface-container-lowest border border-grid-line overflow-hidden rounded-default"
                      :class="idx > 0 ? 'border-l-0' : ''"
                    >
                      <img :src="item.image" :alt="item.name" loading="lazy" class="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div class="min-w-0">
                    <p class="font-body-md text-body-md">{{ order.id }}</p>
                    <p class="font-technical-data text-technical-data text-on-surface-variant uppercase">{{ order.date }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-stack-sm shrink-0">
                  <span
                    class="px-2 py-0.5 rounded-full font-technical-data text-technical-data uppercase hidden md:inline"
                    :class="statusColor(order.status)"
                  >{{ order.statusLabel }}</span>
                  <span class="font-price-display text-price-display">{{ formatPrice(order.total) }}</span>
                  <span
                    class="material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-200"
                    :class="expandedOrder === order.id ? 'rotate-180' : ''"
                    aria-hidden="true"
                  >expand_more</span>
                </div>
              </button>

              <!-- Mobile status badge (outside the accordion header for compact layout) -->
              <span
                class="md:hidden px-2 py-0.5 rounded-full font-technical-data text-technical-data uppercase -mt-2 mb-2 inline-block"
                :class="statusColor(order.status)"
                v-if="expandedOrder !== order.id"
              >{{ order.statusLabel }}</span>

              <div v-if="expandedOrder === order.id" class="pb-stack-md">
                <!-- Mobile status -->
                <span
                  class="md:hidden px-2 py-0.5 rounded-full font-technical-data text-technical-data uppercase mb-stack-sm inline-block"
                  :class="statusColor(order.status)"
                >{{ order.statusLabel }}</span>

                <div class="flex flex-col gap-stack-sm border border-grid-line p-stack-md rounded-default">
                  <div v-for="item in order.items" :key="item.sku" class="flex items-center gap-stack-sm">
                    <div class="w-12 h-12 shrink-0 bg-surface-container-lowest border border-grid-line overflow-hidden rounded-default">
                      <img :src="item.image" :alt="item.name" loading="lazy" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-grow min-w-0">
                      <NuxtLink :to="`/produkty/${item.slug}`" class="font-body-md text-body-md truncate block hover:text-primary transition-colors duration-200">{{ item.name }}</NuxtLink>
                      <p class="font-technical-data text-technical-data text-on-surface-variant uppercase">{{ item.sku }} / x{{ item.quantity }}</p>
                    </div>
                    <span class="font-price-display text-price-display shrink-0">{{ formatPrice(item.price * item.quantity) }}</span>
                  </div>

                  <div class="border-t border-grid-line pt-stack-sm mt-stack-xs">
                    <div class="flex justify-between items-baseline mb-1">
                      <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Doručovacia adresa</span>
                    </div>
                    <p class="font-body-md text-body-md">{{ order.address }}</p>
                  </div>

                  <div v-if="order.tracking" class="flex justify-between items-baseline border-t border-grid-line pt-stack-sm">
                    <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Číslo zásielky</span>
                    <span class="font-body-md text-body-md">{{ order.tracking }}</span>
                  </div>

                  <div class="flex justify-between items-baseline border-t border-grid-line pt-stack-sm">
                    <span class="font-headline-sm text-headline-sm uppercase">Spolu</span>
                    <span class="font-price-display text-headline-md">{{ formatPrice(order.total) }}</span>
                  </div>

                  <div class="flex flex-wrap gap-stack-sm mt-stack-xs">
                    <button
                      v-if="order.status === 'odoslana'"
                      type="button"
                      class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <span class="material-symbols-outlined text-[18px]" aria-hidden="true">local_shipping</span>
                      Sledovať zásielku
                    </button>
                    <button
                      v-if="order.status === 'dorucena'"
                      type="button"
                      class="h-12 px-6 border border-outline-variant text-on-background font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 hover:border-primary rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      @click="activeTab = 'reklamacie'; openNewClaim(); claimForm.orderId = order.id"
                    >
                      <span class="material-symbols-outlined text-[18px]" aria-hidden="true">assignment_return</span>
                      Reklamácia
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ════════ ADRESY ════════ -->
        <section v-if="activeTab === 'adresy'" class="flex flex-col gap-stack-md">
          <div class="flex items-center justify-between">
            <h2 class="font-headline-md text-headline-md uppercase">Uložené adresy</h2>
            <button
              type="button"
              class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              @click="openAddAddress"
            >
              <span class="material-symbols-outlined text-[18px]" aria-hidden="true">add</span>
              Pridať adresu
            </button>
          </div>

          <Transition
            enter-active-class="transition-[opacity,transform] duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-[opacity,transform] duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <p v-if="addressSuccess" class="flex items-center gap-2 font-technical-data text-technical-data uppercase text-green-700 bg-green-50 px-4 py-2 rounded-default">
              <span class="material-symbols-outlined text-[16px]" aria-hidden="true">check_circle</span>
              Adresa bola uložená.
            </p>
          </Transition>

          <!-- Address form -->
          <div v-if="addressForm.visible" class="border border-grid-line p-stack-md rounded-default flex flex-col gap-stack-sm">
            <p class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm">
              {{ addressForm.editId ? 'Upraviť adresu' : 'Nová adresa' }}
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
              <div class="flex flex-col gap-1">
                <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Meno a priezvisko</label>
                <input v-model="addressForm.name" type="text" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Telefón</label>
                <input v-model="addressForm.phone" type="tel" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Ulica a číslo domu</label>
              <input v-model="addressForm.street" type="text" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-stack-sm">
              <div class="flex flex-col gap-1">
                <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Mesto</label>
                <input v-model="addressForm.city" type="text" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">PSČ</label>
                <input v-model="addressForm.postalCode" type="text" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Krajina</label>
                <select v-model="addressForm.country" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
                  <option>Slovensko</option>
                  <option>Česko</option>
                  <option>Maďarsko</option>
                  <option>Rakúsko</option>
                  <option>Poľsko</option>
                  <option>Nemecko</option>
                </select>
              </div>
            </div>
            <div class="flex gap-stack-sm mt-stack-xs">
              <button
                type="button"
                :disabled="addressSaving || !addressForm.name || !addressForm.street || !addressForm.city || !addressForm.postalCode"
                class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                @click="saveAddress"
              >
                <span v-if="addressSaving" class="material-symbols-outlined text-[18px] animate-spin" aria-hidden="true">progress_activity</span>
                {{ addressSaving ? 'Ukladá sa...' : 'Uložiť adresu' }}
              </button>
              <button
                type="button"
                class="h-12 px-6 border border-outline-variant text-on-background font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center cursor-pointer transition-colors duration-200 hover:border-primary rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                @click="cancelAddressForm"
              >
                Zrušiť
              </button>
            </div>
          </div>

          <!-- Address list -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            <div
              v-for="addr in addresses"
              :key="addr.id"
              class="border rounded-default p-stack-md flex flex-col gap-stack-sm"
              :class="addr.isDefault ? 'border-primary' : 'border-grid-line'"
            >
              <div class="flex items-start justify-between">
                <div>
                  <span v-if="addr.isDefault" class="inline-block px-2 py-0.5 rounded-full bg-primary text-on-primary font-technical-data text-technical-data uppercase mb-1">
                    Predvolená
                  </span>
                  <p class="font-headline-sm text-headline-sm">{{ addr.name }}</p>
                </div>
                <div class="flex gap-1">
                  <button
                    type="button"
                    class="min-w-11 min-h-11 flex items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer transition-colors duration-200 [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-default"
                    aria-label="Upraviť adresu"
                    @click="openEditAddress(addr)"
                  >
                    <span class="material-symbols-outlined text-[20px]" aria-hidden="true">edit</span>
                  </button>
                  <button
                    type="button"
                    class="min-w-11 min-h-11 flex items-center justify-center text-on-surface-variant hover:text-error cursor-pointer transition-colors duration-200 [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-default"
                    aria-label="Vymazať adresu"
                    @click="confirmDeleteAddress(addr.id)"
                  >
                    <span class="material-symbols-outlined text-[20px]" aria-hidden="true">delete</span>
                  </button>
                </div>
              </div>
              <div class="font-body-md text-body-md text-on-surface-variant">
                <p>{{ addr.street }}</p>
                <p>{{ addr.postalCode }} {{ addr.city }}</p>
                <p>{{ addr.country }}</p>
                <p class="mt-1">{{ addr.phone }}</p>
              </div>
              <button
                v-if="!addr.isDefault"
                type="button"
                class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary cursor-pointer transition-colors duration-200 w-fit mt-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                @click="setDefaultAddress(addr.id)"
              >
                Nastaviť ako predvolenú
              </button>

              <!-- Delete confirmation -->
              <div v-if="deleteConfirmId === addr.id" class="flex items-center gap-stack-sm border-t border-grid-line pt-stack-sm">
                <p class="font-body-md text-body-md text-error flex-grow">Naozaj chcete vymazať túto adresu?</p>
                <button
                  type="button"
                  class="h-10 px-4 bg-error text-on-error font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center cursor-pointer rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  @click="deleteAddress(addr.id)"
                >
                  Vymazať
                </button>
                <button
                  type="button"
                  class="h-10 px-4 border border-outline-variant text-on-background font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center cursor-pointer rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  @click="cancelDelete"
                >
                  Nie
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ════════ NASTAVENIA ════════ -->
        <section v-if="activeTab === 'nastavenia'" class="flex flex-col gap-stack-lg">
          <h2 class="font-headline-md text-headline-md uppercase">Nastavenia účtu</h2>

          <!-- Personal info -->
          <form class="flex flex-col gap-stack-sm" novalidate @submit.prevent="saveSettings">
            <p class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm">
              Osobné údaje
            </p>
            <Transition
              enter-active-class="transition-[opacity,transform] duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-[opacity,transform] duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <p v-if="settingsSuccess" class="flex items-center gap-2 font-technical-data text-technical-data uppercase text-green-700 bg-green-50 px-4 py-2 rounded-default">
                <span class="material-symbols-outlined text-[16px]" aria-hidden="true">check_circle</span>
                Údaje boli uložené.
              </p>
            </Transition>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
              <div class="flex flex-col gap-1">
                <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Meno</label>
                <input v-model="settingsForm.firstName" type="text" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Priezvisko</label>
                <input v-model="settingsForm.lastName" type="text" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">E-mailová adresa</label>
              <input v-model="settingsForm.email" type="email" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Telefón</label>
              <input v-model="settingsForm.phone" type="tel" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary" />
            </div>
            <div class="flex items-center gap-stack-sm mt-stack-xs">
              <button
                type="submit"
                :disabled="settingsSaving"
                class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span v-if="settingsSaving" class="material-symbols-outlined text-[18px] animate-spin" aria-hidden="true">progress_activity</span>
                {{ settingsSaving ? 'Ukladá sa...' : 'Uložiť zmeny' }}
              </button>
            </div>
          </form>

          <!-- Password -->
          <form class="flex flex-col gap-stack-sm" novalidate @submit.prevent="changePassword">
            <p class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm">
              Zmena hesla
            </p>
            <Transition
              enter-active-class="transition-[opacity,transform] duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-[opacity,transform] duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <p v-if="passwordSuccess" class="flex items-center gap-2 font-technical-data text-technical-data uppercase text-green-700 bg-green-50 px-4 py-2 rounded-default">
                <span class="material-symbols-outlined text-[16px]" aria-hidden="true">check_circle</span>
                Heslo bolo zmenené.
              </p>
            </Transition>
            <p v-if="passwordError" class="font-technical-data text-technical-data text-error">{{ passwordError }}</p>
            <div class="flex flex-col gap-1">
              <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Aktuálne heslo</label>
              <input v-model="passwordForm.current" type="password" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
              <div class="flex flex-col gap-1">
                <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Nové heslo</label>
                <input v-model="passwordForm.newPass" type="password" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Potvrdenie hesla</label>
                <input v-model="passwordForm.confirm" type="password" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <button
              type="submit"
              :disabled="passwordSaving || !passwordForm.current || !passwordForm.newPass || !passwordForm.confirm"
              class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed rounded-default w-fit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span v-if="passwordSaving" class="material-symbols-outlined text-[18px] animate-spin" aria-hidden="true">progress_activity</span>
              {{ passwordSaving ? 'Mení sa...' : 'Zmeniť heslo' }}
            </button>
          </form>

          <!-- Newsletter -->
          <div>
            <p class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm mb-stack-sm">
              Preferencie
            </p>
            <label class="flex items-center gap-stack-sm cursor-pointer select-none">
              <input v-model="user.newsletter" type="checkbox" class="w-5 h-5 accent-primary rounded cursor-pointer" />
              <span class="font-body-md text-body-md">Odoberajte náš newsletter s novinkami a akčnými ponukami</span>
            </label>
          </div>

          <!-- Delete account -->
          <div class="border-t border-grid-line pt-stack-lg">
            <p class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-stack-sm">
              Nebezpečná zóna
            </p>
            <div v-if="!deleteAccountConfirm">
              <button
                type="button"
                class="h-12 px-6 border border-error text-error font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-error hover:text-on-error rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                @click="deleteAccountConfirm = true"
              >
                <span class="material-symbols-outlined text-[18px]" aria-hidden="true">delete_forever</span>
                Vymazať účet
              </button>
            </div>
            <div v-else class="flex flex-col gap-stack-sm border border-error rounded-default p-stack-md">
              <p class="font-body-md text-body-md text-error">
                Naozaj chcete trvalo vymazať svoj účet? Táto akcia je nezvratná a všetky vaše dáta budú vymazané.
              </p>
              <div class="flex gap-stack-sm">
                <button
                  type="button"
                  class="h-12 px-6 bg-error text-on-error font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Áno, vymazať účet
                </button>
                <button
                  type="button"
                  class="h-12 px-6 border border-outline-variant text-on-background font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center cursor-pointer transition-colors duration-200 hover:border-primary rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  @click="deleteAccountConfirm = false"
                >
                  Zrušiť
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ════════ REKLAMACIE ════════ -->
        <section v-if="activeTab === 'reklamacie'" class="flex flex-col gap-stack-md">
          <div class="flex items-center justify-between">
            <h2 class="font-headline-md text-headline-md uppercase">Reklamácie</h2>
            <button
              type="button"
              class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              @click="openNewClaim"
            >
              <span class="material-symbols-outlined text-[18px]" aria-hidden="true">add</span>
              Nová reklamácia
            </button>
          </div>

          <Transition
            enter-active-class="transition-[opacity,transform] duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-[opacity,transform] duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <p v-if="claimSuccess" class="flex items-center gap-2 font-technical-data text-technical-data uppercase text-green-700 bg-green-50 px-4 py-2 rounded-default">
              <span class="material-symbols-outlined text-[16px]" aria-hidden="true">check_circle</span>
              Reklamácia bola podaná.
            </p>
          </Transition>

          <!-- Claim form -->
          <div v-if="claimForm.visible" class="border border-grid-line p-stack-md rounded-default flex flex-col gap-stack-sm">
            <p class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm">
              Nová reklamácia
            </p>
            <div class="flex flex-col gap-1">
              <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Objednávka</label>
              <select v-model="claimForm.orderId" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
                <option value="" disabled>Vyberte objednávku</option>
                <option v-for="o in claimableOrders" :key="o.id" :value="o.id">{{ o.id }} ({{ o.date }})</option>
              </select>
            </div>
            <div v-if="claimForm.orderId" class="flex flex-col gap-1">
              <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Produkt</label>
              <select v-model="claimForm.itemName" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
                <option value="" disabled>Vyberte produkt</option>
                <option v-for="item in claimableItems" :key="item.sku" :value="item.name">{{ item.name }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Dôvod reklamácie</label>
              <select v-model="claimForm.reason" class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
                <option value="" disabled>Vyberte dôvod</option>
                <option v-for="r in claimReasons" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-technical-data text-technical-data uppercase text-on-surface-variant">Popis problému</label>
              <textarea v-model="claimForm.description" rows="3" class="px-4 py-3 bg-white text-on-background font-body-md text-body-md outline-none rounded-default border border-outline-variant focus:ring-2 focus:ring-primary resize-none" />
            </div>
            <div class="flex gap-stack-sm mt-stack-xs">
              <button
                type="button"
                :disabled="claimSaving || !claimForm.orderId || !claimForm.itemName || !claimForm.reason || !claimForm.description"
                class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                @click="submitClaim"
              >
                <span v-if="claimSaving" class="material-symbols-outlined text-[18px] animate-spin" aria-hidden="true">progress_activity</span>
                {{ claimSaving ? 'Odosielam...' : 'Odoslať reklamáciu' }}
              </button>
              <button
                type="button"
                class="h-12 px-6 border border-outline-variant text-on-background font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center cursor-pointer transition-colors duration-200 hover:border-primary rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                @click="claimForm.visible = false"
              >
                Zrušiť
              </button>
            </div>
          </div>

          <!-- Claims list -->
          <div v-if="claims.length" class="flex flex-col border-y border-grid-line divide-y divide-grid-line">
            <div v-for="claim in claims" :key="claim.id" class="flex flex-col md:flex-row md:items-center justify-between gap-stack-sm py-stack-md">
              <div class="flex flex-col gap-1 min-w-0">
                <div class="flex items-center gap-stack-sm flex-wrap">
                  <span class="font-body-md text-body-md font-semibold">{{ claim.id }}</span>
                  <span
                    class="px-2 py-0.5 rounded-full font-technical-data text-technical-data uppercase"
                    :class="claimStatusColor(claim.status)"
                  >{{ claim.statusLabel }}</span>
                </div>
                <p class="font-body-md text-body-md">{{ claim.itemName }}</p>
                <p class="font-technical-data text-technical-data text-on-surface-variant uppercase">
                  {{ claim.orderId }} / {{ claim.reason }} / {{ claim.date }}
                </p>
                <p class="font-body-md text-body-md text-on-surface-variant mt-1">{{ claim.description }}</p>
              </div>
            </div>
          </div>

          <div v-else-if="!claimForm.visible" class="flex flex-col items-center text-center gap-stack-md py-stack-lg">
            <span class="material-symbols-outlined text-[48px] text-on-surface-variant opacity-30" aria-hidden="true">assignment_return</span>
            <p class="font-body-md text-body-md text-on-surface-variant">Zatiaľ nemáme žiadne reklamácie.</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
