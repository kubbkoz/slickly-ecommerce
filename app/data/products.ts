export interface ProductSpec {
  label: string
  value: string
}

export interface ProductReview {
  author: string
  rating: number
  date: string
  text: string
}

export interface Product {
  id: string
  sku: string
  slug: string
  name: string
  category: string
  description: string
  price: number
  oldPrice?: number
  badge?: string
  tags: string[]
  certifications: string[]
  image: string
  gallery: string[]
  inStock: boolean
  specifications: ProductSpec[]
  usage: string[]
  reviews: ProductReview[]
  bundleSlugs?: string[]
}

export interface Category {
  slug: string
  name: string
  description: string
  image: string
}

export const categories: Category[] = [
  {
    slug: 'karoseria',
    name: 'Karoséria',
    description: 'Keramická ochrana, vosky a leštenky pre dokonalý lak.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAOw3lcJ-AW0k4WJ8N4g4_VB8pU10OCmDputy-CLuk2mBkMaDK_qhDpSZ7Q-pMcsb78ykOvxV4ejEjcoMPVNeJBvF_5Gk7Qb5ndRTPF9XBAMcLXXtnDdKskLjMKFm_XFVk1XRvfkUTaPGyKbG6LcULbKIEa70zN2NjmWfdqvsJoKkWHNcTTX8xOkfLVHSkZTq7VEsoShRn41t2ipTpzn9ao8g0xtHmZHD9Ey65uYxPSasbgL9KjsJ7LejJDgXq_Z2yfhiU1V4vWVvhX',
  },
  {
    slug: 'interier',
    name: 'Interiér',
    description: 'Čistiace a ochranné prípravky pre kožu, plasty a textil.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC-ulpuUATLaBjL8jZ7MD9WYEi75v_DgL6trCmYqofHu0G_XAx4JA1WFl7RyjGxdrGBhDYT3D0le7ZqvZy36-69ygRqVUORR3xl5NwRc7t2SHSaV7hCGdkPWlAoQtU8nem4COrGFysNWiS3_S6fjidq_wnygm4t5d15_pUHS-sKaEQNUxVcyN50KS9Qw1gG7ZT5UEwGtg5-rngYNUVXsXSi2VLkz5-JAmnZds2186rAiDj5jm020E3I3Srr4bNwfacNiGtsHU9u3hAB',
  },
  {
    slug: 'kolesa',
    name: 'Kolesá',
    description: 'Disky, pneumatiky a ochrana proti brzdovému prachu.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjJhaegdVwDaUbbbxP7bA-jd2n0qC0zIeXdAJNfRLjPz_3GxRHtkS2n6H9b7KYI8dPpEo3Xnkbj9BYmiTIgRK9AF_4InoaBujMAQowcAm8o6MCeQyPiZAeWpUokziyU4BB-6b_UnWLZR4-D2o9Gr4bSL4KBF_nWHTKmfFkM7a_o2rF9O39Lig1d7GAPVLoPaYoh5bbTDQO2spYJJ1O2EiJMYQVHrn2EgngAUNtLHNmKLsYPxLsv3mvY44XA6BXnTZgiOpr2-d4mZ3n',
  },
  {
    slug: 'ochrana',
    name: 'Ochrana',
    description: 'Hydrofóbne nano-vrstvy a dekontaminačné prípravky.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDq1ViUcjBlJwvLwQHWabkgSVZR9HtWnfxWrK-lIinx97BX5vgGvZwiGwcZLiZlXHBEc1eL_1jFvDrdag-p9DeU14Ik55ESI1jpG6aftFLfFca5yKBpDn-F5vPeGvKTqSixPkwjeN9HAGV2vWE1CFXskisv9jaA_isNPuUSMs5T42ATBPVE2aEnfkNKTDfas0efD-sXi99u5832YJSDh9XSEc2sdnI4SyTd5Fn0Jj76xstx87HQxqHwGa6NHkzRN4UYxabyJVYYxyFB',
  },
]

export const products: Product[] = [
  {
    id: 'prd-01',
    sku: 'PRD-01',
    slug: 'ceramic-shield-v2',
    name: 'Ceramic Shield V2',
    category: 'karoseria',
    description:
      'Pokročilá keramická ochrana laku so zosilnenými väzbami SiO2. Vytvára zrkadlový lesk a nepriestrelnú ochranu proti environmentálnym kontaminantom na 24+ mesiacov.',
    price: 49.0,
    oldPrice: 57.65,
    badge: 'Sale',
    tags: ['SiO2', 'Nano-Tech', 'UV Filter'],
    certifications: ['TÜV Certified', 'ISO 9001:2015'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFeLCzCRH0LSuRZZu7vq8EHmh_ZfKZs3lRqMinCgY-t2nvPamXbDW-1QesEYqoWglhm7f5oTyetNLtG5GM-QQ3u17QuFBhMwa1R5N2q6PLc_Lz9qkNXBkBQHALmYdPeSHCIqJ5QJHHOe2WBXsK9vwgao5BBw9NCbIRhAJsGyca6_iZq-Ewn_Nnsl__qtJdGieJoqtUW2Gs8pTHof_-c4dqu0vnJdJaYL_kj4BaSV5cDxxUcHefEGTGYnRVqE5z9ZDayG3icxAbwxLu',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFeLCzCRH0LSuRZZu7vq8EHmh_ZfKZs3lRqMinCgY-t2nvPamXbDW-1QesEYqoWglhm7f5oTyetNLtG5GM-QQ3u17QuFBhMwa1R5N2q6PLc_Lz9qkNXBkBQHALmYdPeSHCIqJ5QJHHOe2WBXsK9vwgao5BBw9NCbIRhAJsGyca6_iZq-Ewn_Nnsl__qtJdGieJoqtUW2Gs8pTHof_-c4dqu0vnJdJaYL_kj4BaSV5cDxxUcHefEGTGYnRVqE5z9ZDayG3icxAbwxLu',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDqfvgYp-kJav9gkqgmOCsYjiC4So4GJqBaDdrvshiS8mq5C6hkxkm8oDWK8B-dGiOWMMRwf3BBR-0y0ESfGIzvVIhANKwAwABI0mCNdZbAssr5124Ae98epxLYqYIaO-JIQXTvYiTIW0FqIxbg7U-S4yrZ28DWrgYXb68xQU4qAloA0KW2BiiZdT2l71fQqWHagcpUhDZlDbnCsNuLaB1sGiwQuPu9yxPGK_itWLZ-xAnbUba8N0PptKYneergNR78yuNGghEppTOZ',
    ],
    inStock: true,
    specifications: [
      { label: 'Objem', value: '50 ml' },
      { label: 'Životnosť', value: '24+ mesiacov' },
      { label: 'Tvrdosť', value: '9H' },
      { label: 'Vhodné pre', value: 'Všetky farby laku' },
    ],
    usage: [
      'Umyte a odmastite lak (IPA roztok 1:10)',
      'Naneste tenkú vrstvu pomocou aplikátora v krížových ťahoch',
      'Po 2-3 minútach zotrite mikrovláknom do vysokého lesku',
      'Nechajte vytvrdnúť 24h bez vystavenia vode',
    ],
    reviews: [
      { author: 'Martin K.', rating: 5, date: '28. 4. 2026', text: 'Aplikácia bola jednoduchšia ako som čakal, výsledok vydržal cez celú zimu vrátane soli na cestách. Lak vyzerá ako nový.' },
      { author: 'Zuzana H.', rating: 5, date: '15. 3. 2026', text: 'Investícia, ktorá sa oplatí. Auto stačí opláchnuť a voda steká bez šmúh. Odporúčam aj nano sklo k tomu.' },
    ],
    bundleSlugs: ['paint-correction-polish', 'hydro-gloss-detail'],
  },
  {
    id: 'prd-02',
    sku: 'PRD-02',
    slug: 'hydro-gloss-detail',
    name: 'Hydro-Gloss Detail',
    category: 'ochrana',
    description:
      'Okamžitý lesk a hydrofóbna vrstva pre dennú údržbu. Carnauba báza s anti-statickým efektom pre rýchle a bezpečné odpudzovanie vody a prachu.',
    price: 28.9,
    oldPrice: 36.13,
    badge: '-20%',
    tags: ['Carnauba', 'Gloss+', 'Anti-Static'],
    certifications: ['Lab Tested'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwVLLC72kxs5I2fnpz7wDAAhtOuJ-_8-cHosfMmQMM63jEl8Qo8FkMAk20c9rIdxHLvhp3y7NfpV-PCuEfO3_9Hku_i0JreEqtE5cVk7bA_qvzac3SfAb5D465b-OmQYKA_FL2_vP5maqf_CF9C8UZW5WXHTSZcamJbjjc6J7iHaqLS3BMKNnoxMU_pqQYOknynIYDAC6T7WUn_9LJW45UjAR-7gz8vfonrS53FvEMNlJHD24unDTreD8-zD4VKRp1CH-eTn73AJVo',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwVLLC72kxs5I2fnpz7wDAAhtOuJ-_8-cHosfMmQMM63jEl8Qo8FkMAk20c9rIdxHLvhp3y7NfpV-PCuEfO3_9Hku_i0JreEqtE5cVk7bA_qvzac3SfAb5D465b-OmQYKA_FL2_vP5maqf_CF9C8UZW5WXHTSZcamJbjjc6J7iHaqLS3BMKNnoxMU_pqQYOknynIYDAC6T7WUn_9LJW45UjAR-7gz8vfonrS53FvEMNlJHD24unDTreD8-zD4VKRp1CH-eTn73AJVo',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA5aA8CRrfqsNMeW-klM7TClh8cBn9aEEuUjxNst4pZZJ98ZU5O1Vkj0nJv4r6302LdvwQQu_ulyBMcVf7T-Qi2EtDcbB_qzIhlXuRfjFJYsEp-eqpGVnF8E8oY1vfSGD0TLTVWPzCEk2jaj-Y-AIxlH0lwFLSOfZgr5lCtGw3FRt4GAyyDgAcil3fbJZjL1K8zszAlQM8rj5ad1UvXa5i2ohvVxQoWzTUCVJYdSbC49XG_6Crxazh8AGZdh_jnGfWOWE_BIlNJoNu1',
    ],
    inStock: true,
    specifications: [
      { label: 'Objem', value: '500 ml' },
      { label: 'Aplikácia', value: 'Sprej' },
      { label: 'Báza', value: 'Carnauba & polyméry' },
      { label: 'pH', value: 'Neutrálne' },
    ],
    usage: [
      'Aplikujte na čistý, vlažný povrch',
      'Rozotrite mikrovláknovou utierkou',
      'Pre okamžitý lesk vyleštite druhou suchou utierkou',
      'Použiteľné aj na sklo a plasty exteriéru',
    ],
    reviews: [
      { author: 'Tomáš R.', rating: 4, date: '2. 5. 2026', text: 'Skvelý rýchly lesk po umytí, vôňa je príjemná. Jediná výhrada - na veľké auto treba viac sprejov.' },
      { author: 'Petra V.', rating: 5, date: '20. 4. 2026', text: 'Používam po každom umytí, voda krásne perlí aj na sklách. Cena/výkon top.' },
    ],
    bundleSlugs: ['ceramic-shield-v2', 'nano-glass-coating'],
  },
  {
    id: 'prd-03',
    sku: 'PRD-03',
    slug: 'synthetic-iron-decon',
    name: 'Synthetic Iron Decon',
    category: 'kolesa',
    description:
      'Chemická dekontaminácia pre bezpečné odstránenie náletovej hrdze a brzdového prachu z laku a diskov. pH neutrálne zloženie šetrné ku všetkým povrchom.',
    price: 32.0,
    badge: 'Akcia',
    tags: ['pH Neutral', 'Iron Out', 'Reactive'],
    certifications: ['Bio-Degradable', 'REACH Compliant'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuADk929ZSi28yy6sptcygj8hu1snaF6NRuHiApNBXtgfE1aZEtcfKoOgpUdLpO_VsMz_UisVC9ZbfgiFI76_PWzuK_fbX4ib2xCd09Mii1gS3D3DM2dXmmr9ebUPkE5N_macFHoFPrjrDHfJOC-UR_lHSlWx_F_y7QlRLRBDBoA0wh9p2x1qpKjd9y6rTqXB6iRhgr9dql_T-dOrp07_ZYUTvNohaP7QItDzPQbWAxlnAtXNTaeu-LzeNj88myPoiKePmnO_fAr4GKr',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuADk929ZSi28yy6sptcygj8hu1snaF6NRuHiApNBXtgfE1aZEtcfKoOgpUdLpO_VsMz_UisVC9ZbfgiFI76_PWzuK_fbX4ib2xCd09Mii1gS3D3DM2dXmmr9ebUPkE5N_macFHoFPrjrDHfJOC-UR_lHSlWx_F_y7QlRLRBDBoA0wh9p2x1qpKjd9y6rTqXB6iRhgr9dql_T-dOrp07_ZYUTvNohaP7QItDzPQbWAxlnAtXNTaeu-LzeNj88myPoiKePmnO_fAr4GKr',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAzbcXxqkUsLucW3vQh1NUmDTOBFJJGg62EU0bALrKq71hMXYmEniIRcDBaRrBTnnQeLt28BGFVlXLC1iK2eZv6NP8lUgnVy0LFGkdjl0daMX1PhVry_D2fqkLwmyx1xQaiKuU22zfhQUL0DoLD3X7Jca4MAYeso5GCyNo62sj2WDCVHPjii3Xh71gM2yH_fBWsQxqbsmaeeaLoLqB8zuqB1wCDECx4tlH7F_1sNMIyck1GHvtT7mNbZ_yja6WUJuP8tTN2EuBw31mB',
    ],
    inStock: true,
    specifications: [
      { label: 'Objem', value: '500 ml' },
      { label: 'pH', value: 'Neutrálne' },
      { label: 'Reakcia', value: 'Fialová → Bledožltá' },
      { label: 'Riedenie', value: 'Pripravené na použitie' },
    ],
    usage: [
      'Nastriekajte na chladný povrch laku alebo diskov',
      'Sledujte fialovú reakciu rozpúšťajúcich sa kovových častíc',
      'Ponechajte 2-3 minúty, nedovoľte zaschnutie',
      'Dôkladne opláchnite vysokotlakovým čističom',
    ],
    reviews: [
      { author: 'Jakub S.', rating: 5, date: '10. 5. 2026', text: 'Fialová reakcia je naozaj efektná, vidno ako produkt funguje. Disky aj lak boli po aplikácii citeľne hladšie.' },
      { author: 'Lukáš M.', rating: 4, date: '3. 4. 2026', text: 'Funguje presne podľa popisu, treba ale pracovať v tieni, inak rýchlo zasychá.' },
    ],
    bundleSlugs: ['alloy-wheel-cleaner-pro', 'paint-correction-polish'],
  },
  {
    id: 'prd-04',
    sku: 'PRD-04',
    slug: 'interior-revive-foam',
    name: 'Interior Revive Foam',
    category: 'interier',
    description:
      'Bezoplachová čistiaca pena na kožu, plasty a textil. Antibakteriálna formula s UV ochranou proti vyblednutiu palubnej dosky.',
    price: 18.5,
    tags: ['Antibacterial', 'UV Guard', 'Foam Tech'],
    certifications: ['Dermatologically Tested'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDUIlL6gCDbQzkzD3xw3uU2u9AAhFHCe7Nt3NRZ0phtbf41TlYyf9_Rxm-HPeg0eSpFTwijP-2unSr9UMFdmQDBKeSIGZ_hxRJNGDU5YU3HbkuogK1HBK0PBU6wLU_c6ExItw1bqYPx6aYcNfYcxln54ppmdDnswAbJbMTP9wpWyktHaUaT9z578MbbYq-SM-EsfIUkgi4qK2H5nQEN_KM6DAuJKFSpeoB0Nr_Ru-tX3E8ssQpdfeBfpnIBVkhTAHvokbU4XF-4bZLU',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDUIlL6gCDbQzkzD3xw3uU2u9AAhFHCe7Nt3NRZ0phtbf41TlYyf9_Rxm-HPeg0eSpFTwijP-2unSr9UMFdmQDBKeSIGZ_hxRJNGDU5YU3HbkuogK1HBK0PBU6wLU_c6ExItw1bqYPx6aYcNfYcxln54ppmdDnswAbJbMTP9wpWyktHaUaT9z578MbbYq-SM-EsfIUkgi4qK2H5nQEN_KM6DAuJKFSpeoB0Nr_Ru-tX3E8ssQpdfeBfpnIBVkhTAHvokbU4XF-4bZLU',
    ],
    inStock: true,
    specifications: [
      { label: 'Objem', value: '400 ml' },
      { label: 'Aplikácia', value: 'Pena v spreji' },
      { label: 'Vôňa', value: 'Neutrálna' },
      { label: 'Vhodné pre', value: 'Koža, plasty, textil' },
    ],
    usage: [
      'Nastriekajte penu na povrch zo vzdialenosti 15 cm',
      'Rozotrite mikrovláknovou utierkou alebo kefkou',
      'Pre silne znečistené plochy ponechajte pôsobiť 1 minútu',
      'Vytrite do sucha čistou utierkou',
    ],
    reviews: [
      { author: 'Michaela T.', rating: 5, date: '18. 5. 2026', text: 'Vrátila kožené sedadlá takmer do pôvodného stavu, žiadny mastný film. Vôňa je neutrálna, čo som ocenila.' },
      { author: 'Roman B.', rating: 4, date: '29. 3. 2026', text: 'Na palubovku ideálne, na silnejšie škvrny na koberci som musel aplikovať dvakrát.' },
    ],
    bundleSlugs: ['leather-conditioner-elite'],
  },
  {
    id: 'prd-05',
    sku: 'PRD-05',
    slug: 'alloy-wheel-cleaner-pro',
    name: 'Alloy Wheel Cleaner Pro',
    category: 'kolesa',
    description:
      'Profesionálny čistič diskov s indikátorom reakcie. Rozpúšťa zaschnuté nečistoty a brzdový prach bez poškodenia laku alebo eloxovaného povrchu.',
    price: 21.9,
    tags: ['Color-Reactive', 'Acid-Free', 'High Foam'],
    certifications: ['REACH Compliant'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjJhaegdVwDaUbbbxP7bA-jd2n0qC0zIeXdAJNfRLjPz_3GxRHtkS2n6H9b7KYI8dPpEo3Xnkbj9BYmiTIgRK9AF_4InoaBujMAQowcAm8o6MCeQyPiZAeWpUokziyU4BB-6b_UnWLZR4-D2o9Gr4bSL4KBF_nWHTKmfFkM7a_o2rF9O39Lig1d7GAPVLoPaYoh5bbTDQO2spYJJ1O2EiJMYQVHrn2EgngAUNtLHNmKLsYPxLsv3mvY44XA6BXnTZgiOpr2-d4mZ3n',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjJhaegdVwDaUbbbxP7bA-jd2n0qC0zIeXdAJNfRLjPz_3GxRHtkS2n6H9b7KYI8dPpEo3Xnkbj9BYmiTIgRK9AF_4InoaBujMAQowcAm8o6MCeQyPiZAeWpUokziyU4BB-6b_UnWLZR4-D2o9Gr4bSL4KBF_nWHTKmfFkM7a_o2rF9O39Lig1d7GAPVLoPaYoh5bbTDQO2spYJJ1O2EiJMYQVHrn2EgngAUNtLHNmKLsYPxLsv3mvY44XA6BXnTZgiOpr2-d4mZ3n',
    ],
    inStock: true,
    specifications: [
      { label: 'Objem', value: '500 ml' },
      { label: 'pH', value: 'Neutrálne (Acid-Free)' },
      { label: 'Reakcia', value: 'Farebný indikátor' },
      { label: 'Vhodné pre', value: 'Lak, elox, chróm' },
    ],
    usage: [
      'Nastriekajte na studený disk mimo priameho slnka',
      'Sledujte farebnú reakciu s brzdovým prachom',
      'Prekefujte detailingovou kefou do škár disku',
      'Opláchnite dôkladne vodou',
    ],
    reviews: [
      { author: 'Filip D.', rating: 5, date: '7. 5. 2026', text: 'Disky po rokoch zanedbávania vyzerajú ako nové. Farebná reakcia ukáže presne kde treba pridať.' },
      { author: 'Veronika K.', rating: 5, date: '22. 2. 2026', text: 'Acid-free formula ma presvedčila, žiadne biele škvrny na elox dráhach. Pena dobre drží aj na zvislých plochách.' },
    ],
    bundleSlugs: ['synthetic-iron-decon', 'nano-glass-coating'],
  },
  {
    id: 'prd-06',
    sku: 'PRD-06',
    slug: 'paint-correction-polish',
    name: 'Paint Correction Polish',
    category: 'karoseria',
    description:
      'Mikro-abrazívna leštenka na odstránenie vírových škrabancov a oxidácie. Pripravuje povrch na keramickú aplikáciu pre maximálnu priľnavosť.',
    price: 39.0,
    tags: ['Micro-Abrasive', 'Swirl Remover', 'Pre-Coat'],
    certifications: ['ISO 9001:2015'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPhRqMDXGipIWDCSSp3ytrO-1MTeWM7S0sSmC7OfFVduwcDV6bPhAizWem3sHYuDcj1m1ycqjpxA5JWiuQEK3cGBAJjJQA23C1qRh14YGBAtdoz6JTjvMBWun8NykFd6LXVJ1XYC5yHDss73M3hVtVl7fFA9oHJv-31_AA2hCs8RtZB8ZNOMY278SHU1wR3rXtHOD81puLNJeCmNa0W36SqLfrAZtjx-bC_1d3NbpcYHpxMfFmhqMe3msj4g_6KUTUQKcQ60rNf1yr',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPhRqMDXGipIWDCSSp3ytrO-1MTeWM7S0sSmC7OfFVduwcDV6bPhAizWem3sHYuDcj1m1ycqjpxA5JWiuQEK3cGBAJjJQA23C1qRh14YGBAtdoz6JTjvMBWun8NykFd6LXVJ1XYC5yHDss73M3hVtVl7fFA9oHJv-31_AA2hCs8RtZB8ZNOMY278SHU1wR3rXtHOD81puLNJeCmNa0W36SqLfrAZtjx-bC_1d3NbpcYHpxMfFmhqMe3msj4g_6KUTUQKcQ60rNf1yr',
    ],
    inStock: true,
    specifications: [
      { label: 'Objem', value: '250 ml' },
      { label: 'Abrazívnosť', value: 'Mikro-abrazívna (jemná)' },
      { label: 'Aplikácia', value: 'Rotačná/orbitálna leštička' },
      { label: 'Vhodné pre', value: 'Pred-coating prípravu' },
    ],
    usage: [
      'Naneste malé množstvo na leštiacu pad',
      'Pracujte na ploche cca 50x50 cm pri nízkych otáčkach',
      'Postupne zvyšujte otáčky do rozotretia produktu',
      'Zotrite zvyšky mikrovláknom pred aplikáciou ochrany',
    ],
    reviews: [
      { author: 'Marek J.', rating: 5, date: '30. 4. 2026', text: 'Odstránil väčšinu vírových škrabancov po prvom prejdení leštičkou. Lak pred coatingom vypadal skvele.' },
      { author: 'Simona F.', rating: 4, date: '14. 3. 2026', text: 'Mierne abrazívna, takže treba pracovať postupne, ale výsledok stojí za to.' },
    ],
    bundleSlugs: ['ceramic-shield-v2', 'synthetic-iron-decon'],
  },
  {
    id: 'prd-07',
    sku: 'PRD-07',
    slug: 'nano-glass-coating',
    name: 'Nano Glass Coating',
    category: 'ochrana',
    description:
      'Hydrofóbna nano-vrstva na čelné sklo. Zlepšuje výhľad za dažďa odpudzovaním vody pri rýchlostiach nad 60 km/h. Výdrž až 6 mesiacov.',
    price: 24.5,
    badge: 'New',
    tags: ['Hydrophobic', 'Glass-Tech', '6M Durability'],
    certifications: ['Lab Tested', 'ISO 9001:2015'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDq1ViUcjBlJwvLwQHWabkgSVZR9HtWnfxWrK-lIinx97BX5vgGvZwiGwcZLiZlXHBEc1eL_1jFvDrdag-p9DeU14Ik55ESI1jpG6aftFLfFca5yKBpDn-F5vPeGvKTqSixPkwjeN9HAGV2vWE1CFXskisv9jaA_isNPuUSMs5T42ATBPVE2aEnfkNKTDfas0efD-sXi99u5832YJSDh9XSEc2sdnI4SyTd5Fn0Jj76xstx87HQxqHwGa6NHkzRN4UYxabyJVYYxyFB',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDq1ViUcjBlJwvLwQHWabkgSVZR9HtWnfxWrK-lIinx97BX5vgGvZwiGwcZLiZlXHBEc1eL_1jFvDrdag-p9DeU14Ik55ESI1jpG6aftFLfFca5yKBpDn-F5vPeGvKTqSixPkwjeN9HAGV2vWE1CFXskisv9jaA_isNPuUSMs5T42ATBPVE2aEnfkNKTDfas0efD-sXi99u5832YJSDh9XSEc2sdnI4SyTd5Fn0Jj76xstx87HQxqHwGa6NHkzRN4UYxabyJVYYxyFB',
    ],
    inStock: true,
    specifications: [
      { label: 'Objem', value: '30 ml' },
      { label: 'Výdrž', value: 'až 6 mesiacov' },
      { label: 'Aktivácia', value: 'Pri rýchlosti 60+ km/h' },
      { label: 'Vhodné pre', value: 'Čelné sklo, okná, spätné zrkadlá' },
    ],
    usage: [
      'Dôkladne očistite sklo odmastovačom',
      'Naneste tenkú vrstvu v kruhových pohyboch',
      'Ponechajte zmatnieť (60-90 sekúnd)',
      'Vyleštite do čistého priezračného povrchu',
    ],
    reviews: [
      { author: 'Adrián P.', rating: 5, date: '9. 5. 2026', text: 'Pri daždi na diaľnici už takmer nepotrebujem stierače. Aplikácia trvala 10 minút na celé čelné sklo.' },
      { author: 'Natália Š.', rating: 4, date: '25. 1. 2026', text: 'Výdrž okolo 4 mesiacov pri dennom používaní, potom efekt postupne slabne, ale stojí to za opakovanú aplikáciu.' },
    ],
    bundleSlugs: ['hydro-gloss-detail', 'alloy-wheel-cleaner-pro'],
  },
  {
    id: 'prd-08',
    sku: 'PRD-08',
    slug: 'leather-conditioner-elite',
    name: 'Leather Conditioner Elite',
    category: 'interier',
    description:
      'Vyživujúci kondicionér na pravú aj ekologickú kožu. Obnovuje pružnosť a vytvára maticovú UV ochranu bez mastného efektu.',
    price: 22.0,
    tags: ['Matte Finish', 'UV Guard', 'Eco-Leather Safe'],
    certifications: ['Dermatologically Tested'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC-ulpuUATLaBjL8jZ7MD9WYEi75v_DgL6trCmYqofHu0G_XAx4JA1WFl7RyjGxdrGBhDYT3D0le7ZqvZy36-69ygRqVUORR3xl5NwRc7t2SHSaV7hCGdkPWlAoQtU8nem4COrGFysNWiS3_S6fjidq_wnygm4t5d15_pUHS-sKaEQNUxVcyN50KS9Qw1gG7ZT5UEwGtg5-rngYNUVXsXSi2VLkz5-JAmnZds2186rAiDj5jm020E3I3Srr4bNwfacNiGtsHU9u3hAB',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC-ulpuUATLaBjL8jZ7MD9WYEi75v_DgL6trCmYqofHu0G_XAx4JA1WFl7RyjGxdrGBhDYT3D0le7ZqvZy36-69ygRqVUORR3xl5NwRc7t2SHSaV7hCGdkPWlAoQtU8nem4COrGFysNWiS3_S6fjidq_wnygm4t5d15_pUHS-sKaEQNUxVcyN50KS9Qw1gG7ZT5UEwGtg5-rngYNUVXsXSi2VLkz5-JAmnZds2186rAiDj5jm020E3I3Srr4bNwfacNiGtsHU9u3hAB',
    ],
    inStock: false,
    specifications: [
      { label: 'Objem', value: '250 ml' },
      { label: 'Báza', value: 'Vodná emulzia' },
      { label: 'Efekt', value: 'Matný' },
      { label: 'Vhodné pre', value: 'Pravá aj ekologická koža' },
    ],
    usage: [
      'Aplikujte malé množstvo na aplikátor alebo mikrovlákno',
      'Rozotrite rovnomerne po koženom povrchu',
      'Ponechajte vstrebať 5-10 minút',
      'Prebytok zotrite čistou utierkou',
    ],
    reviews: [
      { author: 'Daniel V.', rating: 4, date: '11. 5. 2026', text: 'Koža je po aplikácii mäkšia a matný efekt vypadá prémiovo, žiadny lesklý plastový vzhľad.' },
      { author: 'Lenka G.', rating: 5, date: '5. 4. 2026', text: 'Konečne kondicionér, ktorý nezanecháva mastné odtlačky. Vôňa je jemná a nedráždi.' },
    ],
    bundleSlugs: ['interior-revive-foam'],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((product) => product.category === categorySlug)
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, limit)
}

export function getBundleProducts(product: Product): Product[] {
  if (!product.bundleSlugs?.length) return []
  return product.bundleSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is Product => !!p)
}
