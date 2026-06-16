export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'steps'; items: { title: string; text: string }[] }
  | { type: 'quote'; text: string; author: string }

export interface BlogPost {
  id: string
  slug: string
  category: string
  title: string
  excerpt: string
  date: string
  /** ISO 8601 date used for structured data (datePublished). */
  isoDate: string
  author: string
  readingTime: string
  image: string
  featured?: boolean
  content: BlogBlock[]
}

export const blogPosts: BlogPost[] = [
  {
    id: 'priprava-karoserie',
    slug: 'priprava-karoserie',
    category: 'Návody',
    title: '5 krokov k zrkadlovému lesku: príprava karosérie pred keramickou ochranou',
    excerpt:
      'Výsledná odolnosť a lesk keramickej ochrany závisia od dôkladnej prípravy povrchu. Ukážeme vám postup, ktorý používajú profesionálni detaileri.',
    date: '12. 5. 2026',
    isoDate: '2026-05-12',
    author: 'Tím SLICKLY',
    readingTime: '6 min čítania',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAOw3lcJ-AW0k4WJ8N4g4_VB8pU10OCmDputy-CLuk2mBkMaDK_qhDpSZ7Q-pMcsb78ykOvxV4ejEjcoMPVNeJBvF_5Gk7Qb5ndRTPF9XBAMcLXXtnDdKskLjMKFm_XFVk1XRvfkUTaPGyKbG6LcULbKIEa70zN2NjmWfdqvsJoKkWHNcTTX8xOkfLVHSkZTq7VEsoShRn41t2ipTpzn9ao8g0xtHmZHD9Ey65uYxPSasbgL9KjsJ7LejJDgXq_Z2yfhiU1V4vWVvhX',
    featured: true,
    content: [
      {
        type: 'paragraph',
        text: 'Keramická ochrana je len tak dobrá, ako povrch, na ktorý ju aplikujete. Bez dôkladnej prípravy karosérie sa pod vrstvu SiO2 uzavrú nečistoty, zvyšky starého vosku či drobné škrabance — a tie budú viditeľné ešte mesiace po aplikácii. V tomto návode prejdeme krok za krokom postupom, ktorý odporúčajú profesionálni detaileri pred každou aplikáciou keramickej ochrany.',
      },
      { type: 'heading', text: 'Prečo je príprava kľúčová' },
      {
        type: 'paragraph',
        text: 'Keramický náter sa chemicky naviaže na povrch laku a vytvorí s ním pevné spojenie na 24 a viac mesiacov. Akákoľvek nečistota, mastnota alebo zvyšok ochrany, ktorý sa pod touto vrstvou uzavrie, tam ostane po celú dobu jej životnosti. Investícia 60–90 minút do prípravy sa preto vždy vrátí v podobe vyššej odolnosti, hlbšieho lesku a rovnomernej hydrofóbnej reakcie na celej karosérii.',
      },
      { type: 'heading', text: '5 krokov k zrkadlovému lesku' },
      {
        type: 'steps',
        items: [
          {
            title: 'Predumytie a dekontaminácia',
            text: 'Začnite penovým predumytím (snow foam), ktoré uvoľní hrubú nečistotu bez kontaktu s povrchom. Následne umyte karosériu metódou dvoch vedier s pH neutrálnym šampónom, aby ste predišli vzniku nových mikroriadkov.',
          },
          {
            title: 'Odstránenie kovových čiastočiek a dechtu',
            text: 'Aplikujte železový dekontaminant na disky a karosériu — zmena farby na fialovú signalizuje rozpúšťanie zabrúsených kovových čiastočiek z bŕzd. Zvyšky dechtu a živice odstránite špecializovaným odstraňovačom asfaltu.',
          },
          {
            title: 'Korekcia laku leštením',
            text: 'Jemným brúsnym kotúčom a leštiacou pastou odstránite mikroriadky, oxidáciu a holograms zo staršieho leštenia. Pracujte v menších sekciách a kontrolujte teplotu povrchu, aby ste predišli prehriatiu laku.',
          },
          {
            title: 'Kontrola pod LED svetlom',
            text: 'Denné svetlo skryje veľa nedokonalostí. Prejdite celú karosériu silným LED svetlom pod nízkym uhlom — odhalí zvyšky leštiacej pasty, nedokonale opravené miesta aj prach, ktorý by sa inak zapečatil pod ochranou.',
          },
          {
            title: 'Finálne odmastenie tesne pred aplikáciou',
            text: 'Bezprostredne pred nanesením Ceramic Shield V2 utrite celý povrch roztokom IPA (izopropylalkohol) v pomere 1:10. Odstránite tak akékoľvek mastné zvyšky z leštenia a zabezpečíte maximálnu priľnavosť keramickej vrstvy.',
          },
        ],
      },
      { type: 'heading', text: 'Najčastejšie chyby pri príprave' },
      {
        type: 'list',
        items: [
          'Aplikácia ochrany na teplý povrch alebo na priamom slnku — náter zasychá nerovnomerne a vznikajú šmuhy.',
          'Použitie uterákov z mikrovlákna, ktoré boli predtým v kontakte s voskom alebo silikónom.',
          'Vynechanie kontroly pod LED svetlom — najčastejšia príčina viditeľných holograms po aplikácii.',
          'Príliš krátky čas medzi odmastením a nanesením ochrany, kedy sa na povrch znova usadí prach.',
        ],
      },
      {
        type: 'quote',
        text: 'Príprava je 80 % výsledku. Samotná aplikácia keramickej ochrany trvá pár minút — ale kvalita povrchu pod ňou rozhoduje o tom, ako bude vyzerať o dva roky.',
        author: 'Detailingový poradca SLICKLY',
      },
      {
        type: 'paragraph',
        text: 'Keď je karoséria pripravená podľa týchto krokov, Ceramic Shield V2 sa naviaže rovnomerne na celom povrchu a vytvorí hlboký, zrkadlový lesk s odolnosťou 9H a hydrofóbnym efektom na viac ako 24 mesiacov. Výsledok stojí za každú minútu prípravy.',
      },
    ],
  },
  {
    id: 'starostlivost-o-kozu',
    slug: 'starostlivost-o-kozu',
    category: 'Starostlivosť',
    title: 'Ako často čistiť kožené sedadlá a predĺžiť ich životnosť',
    excerpt:
      'Koža v interiéri vyžaduje pravidelnú a správnu starostlivosť. Poradíme, ako na to bez rizika vysušenia či poškodenia povrchu.',
    date: '28. 4. 2026',
    isoDate: '2026-04-28',
    author: 'Tím SLICKLY',
    readingTime: '4 min čítania',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC-ulpuUATLaBjL8jZ7MD9WYEi75v_DgL6trCmYqofHu0G_XAx4JA1WFl7RyjGxdrGBhDYT3D0le7ZqvZy36-69ygRqVUORR3xl5NwRc7t2SHSaV7hCGdkPWlAoQtU8nem4COrGFysNWiS3_S6fjidq_wnygm4t5d15_pUHS-sKaEQNUxVcyN50KS9Qw1gG7ZT5UEwGtg5-rngYNUVXsXSi2VLkz5-JAmnZds2186rAiDj5jm020E3I3Srr4bNwfacNiGtsHU9u3hAB',
    content: [
      {
        type: 'paragraph',
        text: 'Kožené sedadlá patria medzi najnáročnejšie povrchy v interiéri vozidla. Vystavujú sa pohybu, oteru, slnečnému žiareniu a zmenám teploty — to všetko prirodzeným olejom v koži ubúda. Pravidelná, ale šetrná starostlivosť je rozdiel medzi kožou, ktorá vydrží desať rokov, a takou, ktorá popraská už po dvoch.',
      },
      { type: 'heading', text: 'Ako často čistiť kožu' },
      {
        type: 'paragraph',
        text: 'Pri bežnom používaní postačí jemné čistenie raz za 2 až 4 týždne, kondicionovanie potom približne raz mesačne. Vodiace sedadlo a volant sa opotrebúvajú rýchlejšie, preto im venujte pozornosť častejšie. V lete, keď je koža vystavená vyššej teplote a UV žiareniu cez sklo, skráťte interval kondicionovania na 2–3 týždne.',
      },
      { type: 'heading', text: 'Postup čistenia a kondicionovania' },
      {
        type: 'steps',
        items: [
          {
            title: 'Vysávanie a odstránenie prachu',
            text: 'Pred akýmkoľvek mokrým čistením dôkladne vysajte švy, záhyby a okolie sedadiel. Drobné čiastočky prachu fungujú ako brusivo a pri pretieraní by mohli kožu poškrabať.',
          },
          {
            title: 'Jemné čistenie pH neutrálnym prípravkom',
            text: 'Naneste čistič na mikrovláknovú utierku (nie priamo na kožu) a pretrite povrch krúživými pohybmi. Vyhnite sa prípravkom s alkoholom alebo amoniakom, ktoré vysušujú a odbarvujú kožu.',
          },
          {
            title: 'Dôkladné vysušenie',
            text: 'Po umytí kožu utrite suchým mikrovláknovým uterákom. Zvyšková vlhkosť v švoch môže časom spôsobiť plesne alebo zmäknutie vlákien pod povrchovou vrstvou.',
          },
          {
            title: 'Kondicionovanie a ochrana proti UV',
            text: 'Naneste kondicionér s UV filtrom v tenkej vrstve a nechajte ho vstrebať podľa návodu (zvyčajne 10–15 minút), potom prebytok zotrite. Vytvorí sa tak ochranná vrstva, ktorá dopĺňa oleje a chráni pred vyblednutím.',
          },
        ],
      },
      { type: 'heading', text: 'Čomu sa vyhnúť' },
      {
        type: 'list',
        items: [
          'Čistiacim prostriedkom na sklo alebo univerzálnym odmasťovačom — sú príliš agresívne na farbenú kožu.',
          'Sušeniu fúkaním horúceho vzduchu priamo na kožu, ktoré urýchľuje praskanie.',
          'Drsným hubkám a kefám s tvrdými vláknami.',
          'Dlhodobému parkovaniu na priamom slnku bez clony — UV žiarenie je hlavnou príčinou vyblednutia a praskania kože.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Pri pravidelnej starostlivosti odporúčame Leather Conditioner Elite z našej ponuky — kondicionér s UV filtrom navrhnutý priamo pre kožené interiéry vozidiel, ktorý dopĺňa oleje a obnovuje pružnosť bez lesklého alebo mastného efektu.',
      },
    ],
  },
  {
    id: 'sio2-infusion',
    slug: 'sio2-infusion',
    category: 'Novinky',
    title: 'SiO2 Infusion: nová generácia keramickej ochrany prichádza do sortimentu',
    excerpt:
      'Predstavujeme technológiu, ktorá posúva hydrofóbne vlastnosti keramických náterov na novú úroveň odolnosti a lesku.',
    date: '3. 4. 2026',
    isoDate: '2026-04-03',
    author: 'Tím SLICKLY',
    readingTime: '3 min čítania',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDq1ViUcjBlJwvLwQHWabkgSVZR9HtWnfxWrK-lIinx97BX5vgGvZwiGwcZLiZlXHBEc1eL_1jFvDrdag-p9DeU14Ik55ESI1jpG6aftFLfFca5yKBpDn-F5vPeGvKTqSixPkwjeN9HAGV2vWE1CFXskisv9jaA_isNPuUSMs5T42ATBPVE2aEnfkNKTDfas0efD-sXi99u5832YJSDh9XSEc2sdnI4SyTd5Fn0Jj76xstx87HQxqHwGa6NHkzRN4UYxabyJVYYxyFB',
    content: [
      {
        type: 'paragraph',
        text: 'Do sortimentu SLICKLY čoskoro pribudne nová generácia keramickej chémie s názvom SiO2 Infusion od jedného z našich partnerských výrobcov. Cieľom bolo jednoduché zadanie — posunúť hranice odolnosti a hydrofóbneho efektu, ktoré dnes ponúka Ceramic Shield V2, na ešte vyššiu úroveň.',
      },
      { type: 'heading', text: 'Čo je SiO2 Infusion' },
      {
        type: 'paragraph',
        text: 'Ide o viacvrstvovú formulu, ktorá kombinuje klasické SiO2 väzby so sekundárnou infúznou vrstvou nanočastíc. Táto vrstva sa naviaže do mikroskopických nerovností laku ešte pred vytvorením hlavnej keramickej siete, čím vzniká hutnejší, rovnomernejší a odolnejší film.',
      },
      { type: 'heading', text: 'Výhody novej technológie' },
      {
        type: 'list',
        items: [
          'Vyššia tvrdosť povrchu a lepšia odolnosť proti mikroriadkam pri umývaní.',
          'Silnejší hydrofóbny efekt — voda sa odráža v menších kapkách a rýchlejšie steká aj pri nízkej rýchlosti.',
          'Hlbší, „mokrý" optický efekt laku bez nutnosti dodatočného leštenia.',
          'Predpokladaná životnosť 36+ mesiacov pri dodržaní bežnej údržby.',
        ],
      },
      { type: 'heading', text: 'Kedy bude dostupná' },
      {
        type: 'paragraph',
        text: 'SiO2 Infusion momentálne prechádza záverečnou fázou certifikácie. O zaradení do nášho sortimentu budeme informovať prostredníctvom newslettera — prihláste sa, aby ste sa o novej technológii dozvedeli medzi prvými.',
      },
    ],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export const featuredPost: BlogPost = blogPosts.find((post) => post.featured) ?? blogPosts[0]!

export const regularPosts: BlogPost[] = blogPosts.filter((post) => post.slug !== featuredPost.slug)

export function getOtherPosts(slug: string, limit = 3): BlogPost[] {
  return blogPosts.filter((post) => post.slug !== slug).slice(0, limit)
}
