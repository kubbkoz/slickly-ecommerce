<script setup lang="ts">
import { ArrowRight, Loader2 } from 'lucide-vue-next';
import type { Schemas } from '#shopware';
import { getCategoryUrl } from '~/utils/url';
import { proxyMediaUrl } from '~/utils/media';
import ProductCardMini from '~/components/product/ProductCardMini.vue';

const props = defineProps<{
  category: Schemas['Category'] | null;
  isVisible: boolean;
}>();

defineEmits(['mouseenter', 'mouseleave']);

const { apiClient } = useShopwareContext();
const route = useRoute();
const isLoginModalOpen = useState('loginModalOpen', () => false);

// Očistené a bezpečné načítanie prekladov bez zabíjania SSR reaktivity
const { t } = useStaticTranslations();
const localePath = useLocalePath();

const displayedSubcategories = computed(() => {
    if (!props.category?.children) return [];
    return props.category.children.filter((c: any) => !!c).slice(0, 10);
});

// Dynamic fetching of Recommended products for the current category
// Logic: Try to fetch featured (topseller) products first. Fallback to regular products if empty.
const { data: bestSellers, pending: isFetchingProducts } = await useAsyncData(
  () => `megamenu-products-${props.category?.id}`,
  async () => {
    if (!props.category?.id) return [];

    // Use the category ID directly from the Shopware navigation tree.
    // No name-matching needed — the prop already carries the correct UUID.
    const canonicalCategoryId = props.category.id;

    try {
      // Step 1: Fetch featured products (markAsTopseller)
      const response = await (apiClient as any).invoke("readProductList post /product", {
        body: {
          limit: 4,
          filter: [
            { type: "equals", field: "active", value: true },
            { 
              type: "multi", 
              operator: "OR", 
              queries: [
                { type: "equals", field: "categoryTree", value: canonicalCategoryId },
                { type: "equals", field: "categoryIds", value: canonicalCategoryId }
              ] 
            },
            { type: "equals", field: "markAsTopseller", value: true }
          ],
          associations: {
            media: {},
            cover: { associations: { media: {} } }
          }
        }
      });
      
      let elements = response.data.elements || [];
      
      // Step 2: Fallback if no featured or too few products
      if (elements.length < 4) {
        const remainingCount = 4 - elements.length;
        const exclusionIds = elements.map((e: any) => e.id);
        
        // Use an OR filter to catch products in tree OR directly in category
        // And also fallback to navigation category ID if canonical ID returned nothing
        // Use both the canonical ID and the navigation prop ID for maximum coverage
        const targetIds = [canonicalCategoryId];
        if (props.category?.id && props.category.id !== canonicalCategoryId) {
            targetIds.push(props.category.id);
        }

        const fallbackFilter: any[] = [
          { type: "equals", field: "active", value: true },
          { 
            type: "multi", 
            operator: "OR", 
            queries: targetIds.flatMap((id: string) => [
              { type: "equals", field: "categoryTree", value: id },
              { type: "equals", field: "categoryIds", value: id }
            ])
          }
        ];

        if (exclusionIds.length > 0) {
          fallbackFilter.push({ 
            type: "equalsAny", 
            field: "id", 
            value: exclusionIds,
            negate: true
          });
        }
        
        const fillResponse = await (apiClient as any).invoke("readProductList post /product", {
          body: {
            limit: remainingCount,
            filter: fallbackFilter,
            sort: [{ field: "sales", order: "DESC" }],
            associations: {
              media: {},
              cover: { associations: { media: {} } }
            }
          }
        });
        
        const fillElements = fillResponse.data.elements || [];
        elements = [...elements, ...fillElements];
      }
      
      return elements.slice(0, 4);
    } catch (e) {
      console.error("MegaMenu: Failed to fetch products", e);
      return [];
    }
  },
  { watch: [() => props.category?.id] }
);

const getCategoryImage = (cat: Schemas['Category']) => {
    const url = cat.media?.url || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=contain';
    return proxyMediaUrl(url);
}
</script>

<template>
  <div 
    class="mega-menu-root absolute top-full left-0 w-full bg-white text-black shadow-2xl transition-all duration-300 transform origin-top border-t-4 border-brand z-50 overflow-hidden overflow-y-auto max-h-[calc(100vh-60px)] gpu-boost"
    :class="[
      isVisible ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible -translate-y-4 pointer-events-none'
    ]"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <div v-if="category" class="container mx-auto px-4 lg:px-8 py-5 xl:py-10">
      <div class="grid grid-cols-12 gap-6 xl:gap-12">
        
        <div class="col-span-6 pr-4 xl:pr-8 flex flex-col justify-between min-h-[300px] xl:min-h-[400px]">
          <div>
            <NuxtLink 
              :to="localePath(getCategoryUrl(category))"
              class="font-tech text-2xl xl:text-4xl font-black uppercase text-black mb-5 xl:mb-8 tracking-wide italic cursor-pointer hover:text-brand transition-colors block"
            >
              {{ category.name }}
            </NuxtLink>
            
            <ul class="grid grid-cols-2 gap-x-4 xl:gap-x-8 gap-y-0.5 xl:gap-y-1">
              <li v-for="sub in displayedSubcategories" :key="sub.id" class="group/sub">
                <NuxtLink 
                  v-if="sub"
                  :to="localePath(getCategoryUrl(sub))"
                  class="flex items-center gap-3 xl:gap-6 py-2 xl:py-4 px-3 border-b border-gray-50 hover:bg-gray-50 transition-all duration-200 w-full rounded-none gpu-boost"
                >
                  <div class="w-10 h-10 xl:w-16 xl:h-16 flex-shrink-0 relative overflow-hidden bg-white rounded-none border border-gray-100/50">
                      <img 
                        :src="getCategoryImage(sub)" 
                        alt="" 
                        class="w-full h-full object-contain transition-transform duration-700 p-1"
                      />
                  </div>
                  <div class="flex-1">
                      <span class="block font-tech text-[11px] xl:text-[15px] font-black uppercase tracking-wide text-black group-hover/sub:text-brand transition-colors leading-none">
                        {{ sub.name }}
                      </span>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </div>
          
          <div class="mt-8">
            <NuxtLink 
              :to="localePath(getCategoryUrl(category))"
              class="inline-flex items-center text-brand font-bold uppercase tracking-widest text-xs border-b-2 border-brand pb-1 hover:text-black hover:border-black transition-colors"
            >
              {{ t('zobrazit_vsetko') }} <ArrowRight class="ml-2 w-3 h-3" />
            </NuxtLink>
          </div>
        </div>

        <div class="col-span-6 grid grid-cols-2 gap-4 xl:gap-8">
          <!-- RECOMMENDED PRODUCTS -->
          <div class="col-span-1 flex flex-col min-h-[300px] xl:min-h-[400px]">
             <div class="mb-3 xl:mb-6">
               <h6 class="font-tech text-lg xl:text-2xl font-black uppercase text-black italic leading-none mb-2 xl:mb-3">
                {{ t('megamenu_recommended_products') }}
               </h6>
               <p class="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                {{ t('megamenu_in_category') }} {{ category.name }}
               </p>
            </div>
            
            <div class="flex-1 flex flex-col gap-3 relative">
               <Transition
                 enter-active-class="transition-opacity duration-200"
                 leave-active-class="transition-opacity duration-200"
                 enter-from-class="opacity-0"
                 leave-to-class="opacity-0"
               >
                 <div v-if="isFetchingProducts" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                    <Loader2 class="w-8 h-8 animate-spin text-brand" />
                 </div>
               </Transition>

               <ProductCardMini 
                 v-for="prod in bestSellers" 
                 :key="prod.id" 
                 :product="prod"
               />
               
               <div v-if="!isFetchingProducts && (!bestSellers || bestSellers.length === 0)" class="py-8 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest border border-dashed border-gray-200">
                  {{ t('megamenu_no_recommendations') }}
               </div>
            </div>

            <NuxtLink 
              :to="localePath(getCategoryUrl(category))"
              class="mt-6 text-[10px] font-bold uppercase tracking-widest border-b border-black w-fit hover:text-brand hover:border-brand transition-colors"
            >
              {{ t('prezriet_ponuku') }}
            </NuxtLink>
          </div>

          <!-- CLUB BANNER -->
          <div class="col-span-1 bg-black text-white p-5 xl:p-8 2xl:p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group/banner rounded-none h-full min-h-[300px] xl:min-h-[400px]">
            <div class="absolute inset-0 opacity-20 bg-[url('/assets/images/carbon-fibre.png')]"></div>
            <div class="absolute inset-0 bg-brand/10 transform scale-0 rounded-full group-hover/banner:scale-150 transition-transform duration-700 ease-out gpu-boost"></div>
            
            <div class="relative z-10 flex flex-col justify-center items-center h-full w-full">
              <span class="text-brand font-tech text-sm xl:text-xl uppercase tracking-[0.2em] mb-2 xl:mb-4 block">
                {{ t('megamenu_club_title') }}
              </span>
              <h4 class="font-tech text-xl xl:text-3xl 2xl:text-4xl font-black uppercase italic leading-[1] mb-4 xl:mb-8">
                {{ t('megamenu_club_line1') }} <br/>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand to-red-500">
                  {{ t('megamenu_club_line2') }}
                </span>
              </h4>
              
              <div class="flex flex-col gap-2 xl:gap-3 w-full max-w-[200px] xl:max-w-[240px]">
                <BaseButton 
                  variant="primary"
                  class="w-full !py-2.5 xl:!py-4 !text-xs tracking-widest"
                  @click="isLoginModalOpen = true"
                >
                  {{ t('megamenu_register') }}
                </BaseButton>

                <NuxtLink
                  to="/mtsport-club"
                  class="w-full py-2.5 xl:py-4 border border-white text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center"
                >
                   {{ t('megamenu_club_more_info') }}
                </NuxtLink>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>