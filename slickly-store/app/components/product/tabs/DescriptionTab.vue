<script setup lang="ts">
import { Play, ExternalLink, PackageCheck, Settings, Zap, Mountain, Building2, Coins } from 'lucide-vue-next';
import { type Product } from '~/types';
import { sanitizeHtml } from '~/utils/sanitize';
import { proxyMediaUrl } from '~/utils/media';

const props = defineProps<{
  product: Product;
  customFieldsMedia?: Record<string, string>;
}>();

/**
 * Maps the custom field 'mts_feat_ikona' to a Lucide icon component.
 * 0: No icon, 1: Cog, 2: Lightning, 3: Mountain, 4: Building, 5: Coins
 */
const featureIcon = computed(() => {
    const iconId = Number(props.product.customFields?.mts_feat_ikona);
    if (!iconId || iconId === 0) return null;
    
    const iconMap: Record<number, any> = {
        1: Settings,
        2: Zap,
        3: Mountain,
        4: Building2,
        5: Coins
    };
    
    return iconMap[iconId] || null;
});

/**
 * Resolves a Media UUID from Shopware custom fields by searching 
 * the product.media collection already attached to the product object.
 * We use proxyMediaUrl to ensure dev compatibility (bypassing ORB).
 */
const getMediaUrlFromId = (id: string | null | undefined) => {
  if (!id) return '';
  // Priority 1: batch-resolved map from FrontendDetailPage (custom field media entities)
  if (props.customFieldsMedia?.[id]) return props.customFieldsMedia[id];
  // Fallback: product gallery media (works only if file was also added to product gallery)
  const mediaObj = props.product.media?.find((m: any) => m.media?.id === id || m.mediaId === id);
  return mediaObj?.media?.url ? proxyMediaUrl(mediaObj.media.url) : '';
};

/**
 * Transforms standard YouTube/Vimeo URLs into embed URLs for iframes.
 */
const getEmbedUrl = (url: string | null | undefined) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match?.[2]?.length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
    }
    if (url.includes('vimeo.com')) {
        const regExp = /vimeo\.com\/([0-9]+)/;
        const match = url.match(regExp);
        return match ? `https://player.vimeo.com/video/${match[1]}` : url;
    }
    return url;
};

// Computed check for grid existence to keep the template clean
const hasGrids = computed(() => {
    const cf = props.product.customFields;
    return !!(
        cf?.mts_grid1_title || cf?.mts_grid2_title || cf?.mts_grid3_title || cf?.mts_grid4_title ||
        cf?.mts_grid1_img || cf?.mts_grid2_img || cf?.mts_grid3_img || cf?.mts_grid4_img
    );
});

const grids = computed(() => {
    const cf = props.product.customFields || {};
    return [
        { title: cf.mts_grid1_title, desc: cf.mts_grid1_desc, img: getMediaUrlFromId(cf.mts_grid1_img) },
        { title: cf.mts_grid2_title, desc: cf.mts_grid2_desc, img: getMediaUrlFromId(cf.mts_grid2_img) },
        { title: cf.mts_grid3_title, desc: cf.mts_grid3_desc, img: getMediaUrlFromId(cf.mts_grid3_img) },
        { title: cf.mts_grid4_title, desc: cf.mts_grid4_desc, img: getMediaUrlFromId(cf.mts_grid4_img) }
    ].filter(g => g.title || g.desc || g.img);
});
</script>

<template>
  <div id="product-description-content" class="animate-fade-in relative max-w-7xl mx-auto space-y-16 pb-20">
    
    <!-- 1. Pôvodný popis (Základný text) -->
    <section v-if="product.description" class="prose prose-lg max-w-none text-gray-700 font-sans px-4 md:px-0">
        <div v-html="sanitizeHtml(product.description)"></div>
    </section>

    <!-- 2. Sekcia Features (Hlavný highlight) -->
    <section v-if="product.customFields?.mts_feat_title || product.customFields?.mts_feat_img" class="bg-black text-white p-8 md:p-20 rounded-default overflow-hidden relative">
        <!-- Dynamic Feature Icon (10% white opacity) -->
        <div v-if="featureIcon" class="absolute -top-10 -right-10 opacity-[0.10] text-white pointer-events-none z-0">
            <component :is="featureIcon" class="w-96 h-96" />
        </div>

        <div class="max-w-4xl mx-auto flex flex-col gap-10 relative z-10">
            <!-- Heading -->
            <div class="border-l-[6px] border-brand pl-6">
                <h2 v-if="product.customFields?.mts_feat_title" class="text-2xl md:text-4xl font-bold font-tech uppercase tracking-tight leading-[1.1]">
                    {{ product.customFields.mts_feat_title }}
                </h2>
            </div>

            <!-- Image (Full width under heading) -->
            <div v-if="product.customFields?.mts_feat_img" class="w-full overflow-hidden border border-white/10 shadow-2xl">
                <img 
                    :src="getMediaUrlFromId(product.customFields.mts_feat_img)" 
                    :alt="product.customFields.mts_feat_title || product.name"
                    class="w-full h-auto object-contain transition-transform duration-1000 hover:scale-105"
                    loading="lazy"
                />
            </div>

            <!-- Description & Link -->
            <div class="space-y-8">
                <div 
                    v-if="product.customFields?.mts_feat_desc" 
                    class="prose prose-invert prose-lg max-w-none text-gray-300 font-sans leading-relaxed"
                    v-html="sanitizeHtml(product.customFields.mts_feat_desc)"
                ></div>

                <a 
                    v-if="product.customFields?.mts_feat_url" 
                    :href="product.customFields.mts_feat_url" 
                    class="group inline-flex items-center gap-3 text-brand font-tech uppercase font-bold tracking-widest text-lg hover:text-white transition-all duration-300"
                >
                    <span class="relative">
                        Klikni pre viac info
                        <span class="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <Play class="w-5 h-5 fill-brand group-hover:fill-white group-hover:translate-x-1 transition-all duration-300" />
                </a>
            </div>
        </div>
    </section>

    <!-- 3. Sekcia Grid 1-4 (Technické vychytávky) -->
    <section v-if="hasGrids" class="px-4 md:px-0">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div 
                v-for="(grid, idx) in grids" 
                :key="idx"
                class="group flex flex-col transition-all duration-300"
            >
                <h3 v-if="grid.title" class="text-xl font-bold font-tech uppercase tracking-wide mb-4 flex items-center gap-3">
                    <span class="w-1.5 h-6 bg-brand"></span>
                    {{ grid.title }}
                </h3>
                <div v-if="grid.img" class="mb-6 overflow-hidden rounded-default w-full aspect-video md:aspect-[16/9] bg-zinc-50 border border-gray-100">
                    <img
                        :src="grid.img"
                        :alt="grid.title || ''"
                        class="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
                <div 
                    v-if="grid.desc" 
                    class="prose prose-sm max-w-none text-gray-500 font-sans"
                    v-html="sanitizeHtml(grid.desc)"
                ></div>
            </div>
        </div>
    </section>

    <!-- 4. Video Sekcia -->
    <section v-if="product.customFields?.mts_video_file || product.customFields?.mts_video_url" class="px-4 md:px-0">
        <h2 class="text-xl font-bold font-tech uppercase tracking-wide mb-6 flex items-center gap-3 text-black">
            <span class="w-1.5 h-6 bg-brand"></span>
            {{ product.customFields.mts_video_title || 'Video Showcase' }}
        </h2>

        <div class="relative overflow-hidden rounded-default border-0">
            <!-- Video Player logic -->
            <div class="aspect-video w-full rounded-default overflow-hidden shadow-2xl relative z-10 bg-zinc-900 border border-gray-100">
                <!-- HTML5 Video (Priority) -->
                <video 
                    v-if="product.customFields.mts_video_file" 
                    controls 
                    class="w-full h-full object-cover"
                    preload="metadata"
                >
                    <source :src="getMediaUrlFromId(product.customFields.mts_video_file)" type="video/mp4">
                    Váš prehliadač nepodporuje video tag.
                </video>
                <!-- Embed Video (YouTube/Vimeo) -->
                <iframe 
                    v-else-if="product.customFields.mts_video_url"
                    :src="getEmbedUrl(product.customFields.mts_video_url)"
                    class="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </div>
        </div>
    </section>

    <!-- 5. Kľúčové komponenty (mts_komp) -->
    <section v-if="product.customFields?.mts_komp_title" class="px-4 md:px-0">
        <h2 class="text-xl font-bold font-tech uppercase tracking-wide mb-6 flex items-center gap-3 text-black">
            <span class="w-1.5 h-6 bg-brand"></span>
            {{ product.customFields.mts_komp_title }}
        </h2>
        
        <div class="relative overflow-hidden rounded-default border-0">
            <div 
                v-if="product.customFields?.mts_komp_editor" 
                class="prose prose-md max-w-none text-gray-700 font-sans columns-1 md:columns-2 gap-16 relative z-10"
                v-html="sanitizeHtml(product.customFields.mts_komp_editor)"
            ></div>
        </div>
    </section>

  </div>
</template>

<style scoped>
/* Styling for prose inside DescriptionTab */
:deep(.prose) {
    color: inherit;
}
:deep(.prose h2), :deep(.prose h3), :deep(.prose h4) {
    font-family: 'Space Grotesk', sans-serif;
    text-transform: uppercase;
    font-weight: 800;
}
:deep(.prose h2) {
    font-size: 1.8rem;
    line-height: 2.25rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 800;
}
:deep(.prose ul) {
    list-style-type: none;
    padding-left: 0;
}
:deep(.prose li) {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
}
:deep(.prose li::before) {
    content: "";
    position: absolute;
    left: 0;
    top: 0.65rem;
    width: 7px;
    height: 7px;
    background-color: black; 
    border-radius: 50%;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-spin-extra-slow {
  animation: spin 20s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

