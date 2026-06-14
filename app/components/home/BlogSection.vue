<script setup lang="ts">
interface BlogPost {
  id: string
  category: string
  title: string
  excerpt: string
  date: string
  image: string
}

const posts: BlogPost[] = [
  {
    id: 'priprava-karoserie',
    category: 'Návody',
    title: '5 krokov k zrkadlovému lesku: príprava karosérie pred keramickou ochranou',
    excerpt: 'Výsledná odolnosť a lesk keramickej ochrany závisia od dôkladnej prípravy povrchu. Ukážeme vám postup, ktorý používajú profesionálni detaileri.',
    date: '12. 5. 2026',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAOw3lcJ-AW0k4WJ8N4g4_VB8pU10OCmDputy-CLuk2mBkMaDK_qhDpSZ7Q-pMcsb78ykOvxV4ejEjcoMPVNeJBvF_5Gk7Qb5ndRTPF9XBAMcLXXtnDdKskLjMKFm_XFVk1XRvfkUTaPGyKbG6LcULbKIEa70zN2NjmWfdqvsJoKkWHNcTTX8xOkfLVHSkZTq7VEsoShRn41t2ipTpzn9ao8g0xtHmZHD9Ey65uYxPSasbgL9KjsJ7LejJDgXq_Z2yfhiU1V4vWVvhX',
  },
  {
    id: 'starostlivost-o-kozu',
    category: 'Starostlivosť',
    title: 'Ako často čistiť kožené sedadlá a predĺžiť ich životnosť',
    excerpt: 'Koža v interiéri vyžaduje pravidelnú a správnu starostlivosť. Poradíme, ako na to bez rizika vysušenia či poškodenia povrchu.',
    date: '28. 4. 2026',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC-ulpuUATLaBjL8jZ7MD9WYEi75v_DgL6trCmYqofHu0G_XAx4JA1WFl7RyjGxdrGBhDYT3D0le7ZqvZy36-69ygRqVUORR3xl5NwRc7t2SHSaV7hCGdkPWlAoQtU8nem4COrGFysNWiS3_S6fjidq_wnygm4t5d15_pUHS-sKaEQNUxVcyN50KS9Qw1gG7ZT5UEwGtg5-rngYNUVXsXSi2VLkz5-JAmnZds2186rAiDj5jm020E3I3Srr4bNwfacNiGtsHU9u3hAB',
  },
  {
    id: 'sio2-infusion',
    category: 'Novinky',
    title: 'SiO2 Infusion: nová generácia ochrany prichádza do nášho laboratória',
    excerpt: 'Predstavujeme technológiu, ktorá posúva hydrofóbne vlastnosti keramických náterov na novú úroveň odolnosti a lesku.',
    date: '3. 4. 2026',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDq1ViUcjBlJwvLwQHWabkgSVZR9HtWnfxWrK-lIinx97BX5vgGvZwiGwcZLiZlXHBEc1eL_1jFvDrdag-p9DeU14Ik55ESI1jpG6aftFLfFca5yKBpDn-F5vPeGvKTqSixPkwjeN9HAGV2vWE1CFXskisv9jaA_isNPuUSMs5T42ATBPVE2aEnfkNKTDfas0efD-sXi99u5832YJSDh9XSEc2sdnI4SyTd5Fn0Jj76xstx87HQxqHwGa6NHkzRN4UYxabyJVYYxyFB',
  },
]
</script>

<template>
  <section class="w-full relative py-stack-lg md:py-section-padding-lg bg-surface-container border-y border-grid-line">
    <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin flex flex-col gap-stack-md md:gap-12">
      <div class="flex flex-col gap-1 border-b border-grid-line pb-stack-sm md:pb-6">
        <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight">Blog</h2>
        <p class="font-body-md text-body-md text-on-surface-variant">Tipy, návody a novinky zo sveta starostlivosti o vozidlo.</p>
      </div>

      <!-- Mobile: horizontal scroll -->
      <div class="md:hidden flex gap-stack-sm overflow-x-auto px-gutter -mx-gutter hide-scrollbar snap-x">
        <article
          v-for="post in posts"
          :key="post.id"
          class="min-w-[280px] snap-start flex flex-col gap-stack-sm bg-surface border border-grid-line"
        >
          <div class="aspect-video w-full overflow-hidden">
            <img :src="post.image" :alt="post.title" loading="lazy" class="w-full h-full object-cover" />
          </div>
          <div class="flex flex-col gap-stack-sm p-stack-sm">
            <div class="flex items-center justify-between gap-stack-sm">
              <span class="font-technical-data text-technical-data uppercase text-secondary tracking-widest">{{ post.category }}</span>
              <span class="font-technical-data text-technical-data text-on-surface-variant">{{ post.date }}</span>
            </div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface">{{ post.title }}</h3>
            <p class="font-body-md text-body-md text-on-surface-variant">{{ post.excerpt }}</p>
          </div>
        </article>
      </div>

      <!-- Desktop: grid -->
      <div class="hidden md:grid grid-cols-3 gap-px bg-grid-line border border-grid-line">
        <article v-for="post in posts" :key="post.id" class="flex flex-col gap-stack-sm bg-surface">
          <div class="aspect-video w-full overflow-hidden">
            <img :src="post.image" :alt="post.title" loading="lazy" class="w-full h-full object-cover" />
          </div>
          <div class="flex flex-col gap-stack-sm p-6">
            <div class="flex items-center justify-between gap-stack-sm">
              <span class="font-technical-data text-technical-data uppercase text-secondary tracking-widest">{{ post.category }}</span>
              <span class="font-technical-data text-technical-data text-on-surface-variant">{{ post.date }}</span>
            </div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface">{{ post.title }}</h3>
            <p class="font-body-md text-body-md text-on-surface-variant">{{ post.excerpt }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
