<script setup lang="ts">
import { X, ShoppingCart, Check, Star, ArrowRight } from 'lucide-vue-next';
import BaseButton from '~/components/ui/BaseButton.vue';
import AddToCartButton from '~/components/ui/AddToCartButton.vue';

const props = defineProps<{
  product: any;
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'viewDetails']);

const onClose = () => emit('close');
const onViewDetails = () => emit('viewDetails');

const calculateDiscount = () => {
    if (props.product?.oldPrice && props.product?.price) {
        return Math.round(((props.product.oldPrice - props.product.price) / props.product.oldPrice) * 100);
    }
    return 0;
};

// Handle ESC
onMounted(() => {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') onClose();
    });
});
</script>

<template>
  <div v-if="isOpen && product" class="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        @click="onClose"
      ></div>

      <!-- Modal Content -->
      <div class="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row max-h-[90vh] md:max-h-[800px]">
          
          <!-- Close Button -->
          <button 
             @click="onClose"
             class="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white transition-colors text-black hover:text-brand"
           >
             <X class="w-6 h-6" />
           </button>

           <!-- Left: Image -->
           <div class="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center relative">
              <span v-if="product.oldPrice" class="absolute top-6 left-6 z-10 px-3 py-1.5 text-lg font-black text-white uppercase tracking-wider font-tech bg-brand shadow-lg transform -rotate-2">
                 -{{ calculateDiscount() }}%
              </span>
              <img 
                 :src="product.image" 
                 :alt="product.name" 
                 class="w-full h-full object-contain max-h-[400px] mix-blend-multiply" 
              />
           </div>

           <!-- Right: Details -->
           <div class="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
               <div class="mb-6">
                   <span class="text-brand font-bold text-sm uppercase tracking-widest mb-2 block font-tech">
                       {{ product.category }}
                   </span>
                   <h2 class="text-3xl md:text-4xl font-black text-black leading-tight mb-4 font-tech">
                       {{ product.name }}
                   </h2>

                   <div class="flex items-center space-x-4 mb-6">
                       <div class="flex items-center gap-1">
                           <Star v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'" />
                           <span class="text-gray-400 text-xs ml-2 font-medium font-sans">({{ product.reviewsCount || 0 }} recenzií)</span>
                       </div>
                       <div class="h-4 w-px bg-gray-300"></div>
                       <span class="text-green-600 text-sm font-bold flex items-center font-sans">
                           <Check class="w-4 h-4 mr-1" /> Skladom
                       </span>
                   </div>

                   <div class="flex items-baseline space-x-4 mb-8">
                       <span class="text-4xl font-black text-black font-tech">{{ product.price }} €</span>
                       <span v-if="product.oldPrice" class="text-xl text-gray-400 line-through font-tech">{{ product.oldPrice }} €</span>
                   </div>
                   
                   <p class="text-gray-600 leading-relaxed mb-8 text-lg font-medium font-sans">
                       {{ product.description || 'Popis produktu.' }}
                   </p>

                   <div v-if="product.features" class="mb-8">
                       <h4 class="font-bold text-black mb-3 text-sm uppercase font-tech tracking-wide">Kľúčové vlastnosti:</h4>
                       <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                           <li v-for="(feat, idx) in product.features" :key="idx" class="flex items-start text-sm text-gray-600 font-sans">
                               <div class="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 mr-2 flex-shrink-0"></div>
                               {{ feat }}
                           </li>
                       </ul>
                   </div>
               </div>

               <div class="space-y-4 pt-6 border-t border-gray-100">
                   <div class="flex flex-col sm:flex-row gap-4">
                       <AddToCartButton :product="product" :full-width="true" class="uppercase tracking-wider font-bold" />
                       <BaseButton full-width size="lg" variant="outline" class="uppercase tracking-wide font-bold" @click="onViewDetails">
                           Zobraziť detaily
                       </BaseButton>
                   </div>
               </div>
           </div>
      </div>
  </div>
</template>
