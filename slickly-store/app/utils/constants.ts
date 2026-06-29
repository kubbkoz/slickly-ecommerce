export const NAV_LINKS = [
    { name: 'Bicykle', subcategories: ['Horskí Hardtail', 'Horskí Celoodpružené', 'Gravel & Cyklokros', 'Cestné', 'Detské', 'Krosové'] },
    { name: 'E-Bicykle', subcategories: ['E-Horskí Celoodpružené', 'E-Horskí Hardtail', 'E-Mestské & Tour', 'E-Gravel', 'Príslušenstvo e-bike'] },
    { name: 'Oblečenie', subcategories: ['Dresy', 'Nohavice', 'Bundy & Vesty', 'Tretry', 'Rukavice', 'Prilby', 'Chrániče'] },
    { name: 'Komponenty', subcategories: ['Pohony & Brzdy', 'Kolesá & Plášte', 'Kokpit & Sedlá', 'Vidlice & Tlmiče', 'Pedále'] },
    { name: 'Doplnky', subcategories: ['Svetlá', 'Zámky', 'Tachometre & GPS', 'Batohy & Tašky', 'Fľaše & Košíky', 'Trenažéry'] },
    { name: 'Výpredaj', subcategories: [] },
];

import type { Slide } from '~/types';

export const HERO_SLIDES: Slide[] = [
    {
        id: 'slide-1',
        title: 'SCOTT SPARK RC 2026',
        subtitle: 'Rýchlosť svetového pohára. Integrované tlmenie, nízka hmotnosť a geometria, ktorá vyhráva preteky.',
        image: 'https://mtsport.store/media/b4/8f/de/1768487744/04.png?ts=1768487744',
        cta: 'OBJAVIŤ KOLEKCIU',
        hotspots: [
            { id: 'h1', x: 45, y: 55, label: 'Rám Carbon HMX', description: 'Revolučná integrácia tlmiča do rámu pre nižšie ťažisko a čistý dizajn.', price: '3 499 € (Rám)' },
            { id: 'h2', x: 72, y: 65, label: 'Kolesá Syncros Silverton', description: 'Jednodielna karbónová konštrukcia pre maximálny prenos sily.', price: '1 899 €' },
            { id: 'h3', x: 25, y: 40, label: 'Kokpit Fraser iC SL', description: 'Ultraľahký integrovaný kokpit pre agresívnu jazdnú pozíciu.', price: '499 €' },
        ]
    },
    {
        id: 'slide-2',
        title: 'NOVÁ DEFINÍCIA E-BIKE',
        subtitle: 'KTM Macina Prowler s motorom Bosch Performance CX Race. Výkon bez kompromisov.',
        image: 'https://images.unsplash.com/photo-1618762044398-ec1e7e048bbd?q=80&w=2500&auto=format&fit=crop',
        cta: 'PREZRIEŤ E-BIKY',
        hotspots: [
            { id: 'h4', x: 50, y: 50, label: 'Motor Bosch CX Race', description: 'Limitovaná edícia motora s podporou až 400% a režimom Race Mode.', price: 'Súčasť' },
            { id: 'h5', x: 35, y: 70, label: 'Odpruženie FOX Factory', description: 'Povrchová úprava Kashima pre maslovo hladký chod.', price: 'Súčasť' }
        ]
    }
];

export const FEATURES = [
    { title: 'DORUČENIE TOVARU', desc: 'Bicykle, e-bike, doplnky a komponenty v hodnote viac ako 100€ Vám doručíme ZADARMO.', icon: 'Truck' },
    { title: 'ODBORNÝ SERVIS', desc: 'Certifikovaný servis e-bikov pre Bosch, Shimano, Yamaha, Pinion, Ananda, Bafang, atď.', icon: 'Wrench' },
    { title: 'ODBORNÉ PORADENSTVO', desc: 'Neviete si vybrať? Naši odborní predajcovia Vám pomôžu vybrať vhodný bicykel, alebo e-bike.', icon: 'MessageCircle' },
    { title: 'BEZPEČNÉ DORUČENIE', desc: 'Bicykle, alebo e-bike Vám doručíme priamo domov, plne zmontované, nastavené a bezpečne zabalené.', icon: 'ShieldCheck' },
];

// Featured značky na frontpage (sekcia Znacky.vue). Slug = slugify(názov výrobcu)
// z /api/manufacturers. Poradie určuje poradie dlaždíc. Zobrazí sa prvých 5 nájdených.
// Editovať podľa potreby — logá sa ťahajú z backendu, tu sa určuje len výber a poradie.
export const FEATURED_BRAND_SLUGS = [
    'sprint',
    'haibike',
    'kands',
    'superior',
    'romet',
];

// ... (Rest of constants will be added as needed or fully ported if critical)
// For now porting ALL_PRODUCTS generation logic might be too much for this single file if I can avoid it, 
// but SearchBar depends on NEW_PRODUCTS. I should probably include it.
// To save space/time, I will mock NEW_PRODUCTS briefly or copy the generation logic if I can.
// Let's copy the generation logic since it's used for SearchBar fallback.


export const CATEGORIES = [
    { id: 'c1', title: 'BICYKLE', image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?q=80&w=800&auto=format&fit=crop', link: '#' },
    { id: 'c2', title: 'ELEKTROBICYKLE', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=800&auto=format&fit=crop', link: '#' },
    { id: 'c3', title: 'DOPLNKY K BICYKLOM', image: 'https://images.unsplash.com/photo-1559132148-369dd4432172?q=80&w=800&auto=format&fit=crop', link: '#' },
    { id: 'c4', title: 'KOMPONENTY', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop', link: '#' },
    { id: 'c5', title: 'OBLEČENIE', image: 'https://images.unsplash.com/photo-1558529324-71b5635075de?q=80&w=800&auto=format&fit=crop', link: '#' },
    { id: 'c6', title: 'E-BIKE DIELY', image: 'https://images.unsplash.com/photo-1623053398290-34a974b26090?q=80&w=800&auto=format&fit=crop', link: '#' },
];

const generateMockProducts = (count: number) => {
    const products: any[] = [];

    // Seeded Random Helper (Mulberry32)
    let seed = 123456789;
    const random = () => {
        var t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };

    const brands = ['Scott', 'Kellys', 'KTM', 'Haibike', 'Cube', 'Fox', 'Shimano', 'Endura', 'Garmin', 'Abus'];
    const colors = ['Čierna', 'Biela', 'Červená', 'Modrá', 'Zelená', 'Oranžová', 'Sivá', 'Žltá'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const types = [
        { cat: 'Bicykle', sub: 'Horskí Celoodpružené', names: ['Spark RC', 'Genius', 'Swag', 'Prowler', 'Stereo'], priceBase: 3500, img: 'https://images.unsplash.com/photo-1576435728678-38d01d52e38b?q=80&w=600&auto=format&fit=crop' },
        { cat: 'Bicykle', sub: 'Horskí Hardtail', names: ['Scale', 'Spider', 'Ultra', 'Reaction'], priceBase: 1200, img: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=600&auto=format&fit=crop' },
        { cat: 'Bicykle', sub: 'Gravel & Cyklokros', names: ['Addict Gravel', 'Nuroad', 'Speedster'], priceBase: 1800, img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=600&auto=format&fit=crop' },
        { cat: 'Bicykle', sub: 'Cestné', names: ['Addict RC', 'Litening', 'Foil'], priceBase: 4000, img: 'https://images.unsplash.com/photo-1559348349-86f163ed3413?q=80&w=600&auto=format&fit=crop' },
        { cat: 'Bicykle', sub: 'Detské', names: ['Roxter', 'Access', 'Numove'], priceBase: 350, img: 'https://images.unsplash.com/photo-1595247853609-b472097033a3?q=80&w=600&auto=format&fit=crop' },
        { cat: 'E-Bicykle', sub: 'E-Horskí Celoodpružené', names: ['Patron eRIDE', 'Theos', 'Macina Kapoho', 'Stereo Hybrid'], priceBase: 5500, img: 'https://images.unsplash.com/photo-1623053398290-34a974b26090?q=80&w=600&auto=format&fit=crop' },
        { cat: 'E-Bicykle', sub: 'E-Horskí Hardtail', names: ['Aspect eRIDE', 'Reaction Hybrid', 'Macina Team'], priceBase: 2800, img: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=600&auto=format&fit=crop' },
        { cat: 'E-Bicykle', sub: 'E-Mestské & Tour', names: ['Sub Sport', 'Kathmandu', 'Macina City'], priceBase: 2500, img: 'https://images.unsplash.com/photo-1618762044398-ec1e7e048bbd?q=80&w=600&auto=format&fit=crop' },
        { cat: 'Oblečenie', sub: 'Dresy', names: ['Ranger Jersey', 'Flexair', 'Enduro Tee'], priceBase: 50, img: 'https://images.unsplash.com/photo-1558529324-71b5635075de?q=80&w=600&auto=format&fit=crop' },
        { cat: 'Oblečenie', sub: 'Nohavice', names: ['Defend Pants', 'Ranger Shorts', 'Flexair Pants'], priceBase: 120, img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=600&auto=format&fit=crop' },
        { cat: 'Oblečenie', sub: 'Prilby', names: ['Speedframe', 'Mainframe', 'Stego', 'Proframe'], priceBase: 150, img: 'https://images.unsplash.com/photo-1559132148-369dd4432172?q=80&w=600&auto=format&fit=crop' },
        { cat: 'Oblečenie', sub: 'Tretry', names: ['Kestrel', 'Hellcat', 'Freerider'], priceBase: 130, img: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop' },
        { cat: 'Komponenty', sub: 'Pohony & Brzdy', names: ['XT Derailleur', 'GX Eagle', 'Code R'], priceBase: 150, img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop' },
        { cat: 'Komponenty', sub: 'Kolesá & Plášte', names: ['Minion DHF', 'Crossmax', 'Silverton'], priceBase: 80, img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop' },
        { cat: 'Doplnky', sub: 'Svetlá', names: ['Ion Pro', 'Aura 80', 'Buster'], priceBase: 60, img: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600&auto=format&fit=crop' },
        { cat: 'Doplnky', sub: 'Tachometre & GPS', names: ['Edge 540', 'Roam', 'Bolt'], priceBase: 250, img: 'https://images.unsplash.com/photo-1628197770857-3f339460f387?q=80&w=600&auto=format&fit=crop' },
        { cat: 'Doplnky', sub: 'Zámky', names: ['Bordo 6000', 'Evolution Mini', 'Granit X-Plus'], priceBase: 90, img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?q=80&w=600&auto=format&fit=crop' }
    ];

    products.push(
        { id: 'p1', name: 'Scott Patron eRIDE 900', category: 'E-Bicykle', subcategory: 'E-Horskí Celoodpružené', brand: 'Scott', price: 7699, image: 'https://images.unsplash.com/photo-1623053398290-34a974b26090?q=80&w=600&auto=format&fit=crop', badge: 'Novinka', description: 'Nový Scott Patron eRIDE.', features: ['Rám Carbon/Alloy', 'Vidlica FOX 38 Perf. 160mm', 'Bosch CX 85Nm'], rating: 5, reviewsCount: 4, hasVariants: true, gender: 'Unisex', color: 'Čierna', wheelSize: '29"' },
        { id: 'p2', name: 'Kellys Swag 50', category: 'Bicykle', subcategory: 'Horskí Celoodpružené', brand: 'Kellys', price: 2899, oldPrice: 3199, image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=600&auto=format&fit=crop', badge: 'Výpredaj', description: 'Kellys Swag 50 je čistokrvné enduro.', features: ['Rám KELLYS Enduro 29', 'Rock Shox ZEB 170mm'], rating: 4.8, reviewsCount: 23, hasVariants: true, gender: 'Pánske', color: 'Oranžová', wheelSize: '29"' },
        { id: 'p3', name: 'KTM Macina Kapoho', category: 'E-Bicykle', subcategory: 'E-Horskí Celoodpružené', brand: 'KTM', price: 5499, image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=600&auto=format&fit=crop', badge: 'Top', description: 'Vrchol ponuky KTM.', features: ['Bosch CX Gen4 Smart', '750Wh'], rating: 4.9, reviewsCount: 12, hasVariants: true, gender: 'Unisex', color: 'Oranžová', wheelSize: '29"' }
    );

    for (let i = products.length; i < count; i++) {
        const type = types[Math.floor(random() * types.length)]!;
        const brand = brands[Math.floor(random() * brands.length)]!;
        const model = type.names[Math.floor(random() * type.names.length)]!;
        const basePrice = type.priceBase + Math.floor(random() * 500);
        const isSale = random() > 0.85;

        products.push({
            id: `gen-${i}`,
            name: `${brand} ${model}`,
            category: type.cat,
            subcategory: type.sub,
            brand: brand,
            price: isSale ? Math.round(basePrice * 0.8) : basePrice,
            oldPrice: isSale ? basePrice : undefined,
            image: type.img,
            badge: random() > 0.8 ? 'Novinka' : (isSale ? 'Výpredaj' : undefined),
            description: `Špičkový ${type.sub.toLowerCase()}.`,
            rating: 3.5 + random() * 1.5,
            reviewsCount: Math.floor(random() * 20),
            hasVariants: true,
            gender: random() > 0.7 ? 'Dámske' : 'Pánske',
            color: colors[Math.floor(random() * colors.length)],
            wheelSize: '29"'
        });
    }

    return products;
};

export const ALL_PRODUCTS = generateMockProducts(150);
export const NEW_PRODUCTS = ALL_PRODUCTS.slice(0, 8);
export const RECOMMENDED_PRODUCTS = ALL_PRODUCTS.slice(8, 16);

export const BLOG_POSTS = [
    {
        id: 'b1',
        title: 'TOP 10 TRÁS NA SLOVENSKU: KDE SI NAJLEPŠIE ZAJAZDÍTE?',
        excerpt: 'Slovensko ponúka nespočetné množstvo cyklistických trás. Vybrali sme pre vás tie najkrajšie, od náročných horských výstupov až po pohodové rodinné výlety.',
        image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=800&auto=format&fit=crop',
        date: '12. MÁJ 2026',
        author: 'Jakub Novák',
        category: 'Tipy na výlet'
    },
    {
        id: 'b2',
        title: 'AKO SI VYBRAŤ SPRÁVNY E-BIKE: KOMPLETNÝ SPRIEVODCA',
        excerpt: 'Neviete sa zorientovať v ponuke elektrobicyklov? Poradíme vám, na čo sa zamerať pri výbere motora, batérie a typu rámu.',
        image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=800&auto=format&fit=crop',
        date: '08. MÁJ 2026',
        author: 'Peter Svoboda',
        category: 'Radíme'
    },
    {
        id: 'b3',
        title: 'NOVINKA OD SCOTT: SPARK RC 2026 V DETAILNOM TESTE',
        excerpt: 'Otestovali sme horúcu novinku od Scottu. Je nový Spark skutočne taký rýchly, ako sa hovorí? Prečítajte si našu recenziu.',
        image: 'https://images.unsplash.com/photo-1576435728678-38d01d52e38b?q=80&w=800&auto=format&fit=crop',
        date: '01. MÁJ 2026',
        author: 'Martin Kováč',
        category: 'Recenzie'
    }
];
