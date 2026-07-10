import type { Slide } from '~/types';

// Fallback hero slides — zobrazia sa len ak CMS/Shopware kategória pre hero
// slider (CategoryHeroSlider.vue) nevráti žiadne reálne slidy.
export const HERO_SLIDES: Slide[] = [
    {
        id: 'slide-1',
        title: 'STAROSTLIVOSŤ O AUTO NA NOVEJ ÚROVNI',
        subtitle: 'Profesionálna autokozmetika, detailing produkty a príslušenstvo pre dokonalý vzhľad exteriéru aj interiéru.',
        image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2500&auto=format&fit=crop',
        cta: 'OBJAVIŤ PONUKU',
        hotspots: []
    },
    {
        id: 'slide-2',
        title: 'OCHRANA KAROSÉRIE A LEŠTENIE',
        subtitle: 'Chráňte lak vášho vozidla a dosiahnite zrkadlový lesk s overenými produktmi na starostlivosť o auto.',
        image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2500&auto=format&fit=crop',
        cta: 'PREZRIEŤ LEŠTENIE',
        hotspots: []
    }
];

export const FEATURES = [
    { title: 'ŠIROKÝ SORTIMENT', desc: 'Stovky produktov na exteriér, interiér aj leštenie od overených značiek na jednom mieste.', icon: 'Package' },
    { title: 'STAROSTLIVOSŤ O AUTO', desc: 'Kompletná ponuka pre ochranu karosérie a starostlivosť o vaše auto po celý rok.', icon: 'Car' },
    { title: 'DETAILING', desc: 'Profesionálne detailing produkty a príslušenstvo pre dokonalý vzhľad exteriéru aj interiéru.', icon: 'Sparkles' },
    { title: 'RÝCHLE DORUČENIE', desc: 'Objednávku spracujeme a odošleme čo najskôr, aby ste sa mohli pustiť do práce bez čakania.', icon: 'Truck' },
];

// Featured značky na frontpage (sekcia Znacky.vue). Slug = slugify(názov výrobcu)
// z /api/manufacturers. Poradie určuje poradie dlaždíc. Zobrazí sa prvých 5 nájdených,
// chýbajúce sa ticho preskočia (Znacky.vue) — bezpečné nechať prázdne, kým sa nedoplnia
// reálne slugy značiek starostlivosti o auto z Shopware backendu.
export const FEATURED_BRAND_SLUGS: string[] = [];
