import { ref } from 'vue';
import { d as useRoute } from './server.mjs';

const TRANSLATIONS = {
  // TopBar / Desktop / Mobile shared
  magazin: { sk: "SLICKLY Blog", cz: "SLICKLY Blog", pl: "SLICKLY Blog", de: "SLICKLY Blog", en: "SLICKLY Bloge", hu: "SLICKLY Blog" },
  kontakty: { sk: "Kontakty", cz: "Kontakty", pl: "Kontakty", de: "Kontakte", en: "Contacts", hu: "Kapcsolat" },
  vsetko_o_nakupe: { sk: "Všetko o nákupe", cz: "Vše o nákupu", pl: "Wszystko o zakupach", de: "Alles über den Einkauf", en: "All about shopping", hu: "Minden a vásárlásról" },
  o_nas: { sk: "O nás", cz: "O nás", pl: "O nas", de: "Über uns", en: "About us", hu: "Rólunk" },
  kamenna_predajna: { sk: "Kamenná predajňa", cz: "Kamenná prodejna", pl: "Sklep stacjonarny", de: "Ladengeschäft", en: "Physical Store", hu: "Üzletünk" },
  // MegaMenu
  zobrazit_vsetko: { sk: "Zobraziť všetko", cz: "Zobrazit vše", pl: "Pokaż wszystko", de: "Alles anzeigen", en: "Show all", hu: "Összes megjelenítése" },
  prezriet_ponuku: { sk: "Prezrieť ponuku", cz: "Prohlédnout nabídku", pl: "Zobacz ofertę", de: "Angebot ansehen", en: "View offer", hu: "Ajánlat megtekintése" },
  megamenu_recommended_products: { sk: "Odporúčané produkty", cz: "Doporučené produkty", pl: "Polecane produkty", de: "Empfohlene Produkte", en: "Recommended products", hu: "Ajánlott termékek" },
  megamenu_in_category: { sk: "V kategórii", cz: "V kategorii", pl: "W kategorii", de: "In der Kategorie", en: "In category", hu: "A kategóriában" },
  megamenu_no_recommendations: { sk: "Žiadne odporúčania", cz: "Žádná doporučení", pl: "Brak rekomendacji", de: "Keine Empfehlungen", en: "No recommendations", hu: "Nincs ajánlás" },
  megamenu_club_title: { sk: "SLICKLY CLUB", cz: "SLICKLY CLUB", pl: "SLICKLY CLUB", de: "SLICKLY CLUB", en: "SLICKLY CLUB", hu: "SLICKLY CLUB" },
  megamenu_club_line1: { sk: "Staň sa členom klubu a získaj", cz: "Staňte se členem klubu a získejte", pl: "Zostań członkiem klubu i zyskaj", de: "Werden Sie Clubmitglied und erhalten Sie", en: "Become a member of the club and get", hu: "Legyen klubtag és szerezzen" },
  megamenu_club_line2: { sk: "množstvo výhod", cz: "množství výhod", pl: "wiele korzyści", de: "viele Vorteile", en: "lots of benefits", hu: "számos előnyt" },
  megamenu_club_more_info: { sk: "Viac informácií", cz: "Více informací", pl: "Więcej informacji", de: "Mehr Infos", en: "More info", hu: "Több információ" },
  MEGAMENU_CLUB_MORE_INFO: { sk: "Viac informácií", cz: "Více informací", pl: "Więcej informacji", de: "Mehr Infos", en: "More info", hu: "Több információ" },
  megamenu_register: { sk: "Registrovať sa", cz: "Registrovat se", pl: "Zarejestruj się", de: "Registrieren", en: "Register", hu: "Regisztráció" },
  // MobileMenu
  prihlasit: { sk: "Prihlásiť", cz: "Přihlásit", pl: "Zaloguj się", de: "Anmelden", en: "Login", hu: "Bejelentkezés" },
  prechadzat_kategorie: { sk: "Prechádzať kategórie", cz: "Procházet kategorie", pl: "Przeglądaj kategorie", de: "Kategorien durchsuchen", en: "Browse categories", hu: "Kategóriák böngészése" },
  testy_recenzie_novinky: { sk: "Testy, recenzie a novinky", cz: "Testy, recenze a novinky", pl: "Testy, recenzje i nowości", de: "Tests, Rezensionen und Neuigkeiten", en: "Tests, reviews and news", hu: "Tesztek, értékelések és hírek" },
  // General UI
  viac_info: { sk: "Viac info", cz: "Více info", pl: "Więcej info", de: "Mehr Infos", en: "More info", hu: "Több infó" },
  predajna: { sk: "Predajňa", cz: "Prodejna", pl: "Sklep", de: "Laden", en: "Store", hu: "Üzlet" },
  // CategoryGrid
  vsetky_kategorie: { sk: "Všetky kategórie", cz: "Všechny kategorie", pl: "Wszystkie kategorie", de: "Alle Kategorien", en: "All categories", hu: "Összes kategória" },
  prezriet: { sk: "Prezrieť", cz: "Prohlédnout", pl: "Zobacz", de: "Ansehen", en: "View", hu: "Megtekintés" },
  vyber_si: { sk: "Vyberte si", cz: "Vyběrte si", pl: "Wybierz", de: "Wähle", en: "Choose", hu: "Válassz" },
  kategoriu: { sk: "Kategóriu", cz: "Kategorii", pl: "Kategorię", de: "Kategorie", en: "Category", hu: "Kategóriát" },
  category_grid_subtext: { sk: "Objavte našu širokú ponuku autokozmetiky, detailing produktov a príslušenstva", cz: "Objevte naši širokou nabídku autokosmetiky, detailingových produktů a příslušenství", pl: "Odkryj naszą szeroką ofertę kosmetyków samochodowych, produktów detailingowych i akcesoriów", de: "Entdecken Sie unser breites Angebot an Autopflegeprodukten, Detailing-Produkten und Zubehör", en: "Discover our wide range of car care products, detailing products and accessories", hu: "Fedezze fel autókozmetikai termékek, detailing termékek és kiegészítők széles választékát" },
  // Značky
  znacky: { sk: "Značky", cz: "Značky", pl: "Marki", de: "Marken", en: "Brands", hu: "Márkák" },
  vsetky_znacky: { sk: "Všetky značky", cz: "Všechny značky", pl: "Wszystkie marki", de: "Alle Marken", en: "All brands", hu: "Összes márka" },
  znacky_subtext: { sk: "Prehľad všetkých značiek a výrobcov v našej ponuke", cz: "Přehled všech značek a výrobců v naší nabídce", pl: "Przegląd wszystkich marek i producentów w naszej ofercie", de: "Übersicht aller Marken und Hersteller in unserem Angebot", en: "Overview of all brands and manufacturers in our offer", hu: "Kínálatunk összes márkájának és gyártójának áttekintése" },
  // TopBar info
  otvaracie_hodiny: { sk: "Po-So: 7:00 - 16:00", cz: "Po-So: 7:00 - 16:00", pl: "Pn-Sb: 7:00 - 16:00", de: "Mo-Sa: 7:00 - 16:00", en: "Mo-Sa: 7:00 - 16:00", hu: "Hé-Szo: 7:00 - 16:00" },
  // Search
  hladat_placeholder: { sk: "Hľadať produkt, kategóriu...", cz: "Hledat produkt, kategorii...", pl: "Szukaj produktu, kategorii...", de: "Produkt, Kategorie suchen...", en: "Search product, category...", hu: "Keress terméket, kategóriát..." },
  hladat_kratky: { sk: "Hľadať...", cz: "Hledat...", pl: "Szukaj...", de: "Suchen...", en: "Search...", hu: "Keresés..." },
  pocuvam: { sk: "Počúvam...", cz: "Poslouchám...", pl: "Słucham...", de: "Ich höre...", en: "Listening...", hu: "Figyelek..." },
  vyhladat_podla_obrazka: { sk: "Vyhľadať podľa obrázka", cz: "Vyhledat podle obrázku", pl: "Szukaj po zdjęciu", de: "Nach Bild suchen", en: "Search by image", hu: "Keresés kép alapján" },
  produkty: { sk: "Produkty", cz: "Produkty", pl: "Produkty", de: "Produkte", en: "Products", hu: "Termékek" },
  zobrazit_vsetky_vysledky: { sk: "Zobraziť všetky výsledky", cz: "Zobrazit všechny výsledky", pl: "Pokaż wszystkie wyniki", de: "Alle Ergebnisse anzeigen", en: "Show all results", hu: "Összes eredmény megjelenítése" },
  nenasli_sa_produkty: { sk: "Nenašli sa žiadne produkty.", cz: "Nenalezeny žádné produkty.", pl: "Nie znaleziono produktów.", de: "Keine Produkte gefunden.", en: "No products found.", hu: "Nem találhatók termékek." },
  popularne_kategorie: { sk: "Populárne kategórie", cz: "Populární kategorie", pl: "Popularne kategorie", de: "Beliebte Kategorien", en: "Popular categories", hu: "Népszerű kategóriák" },
  odporucame: { sk: "Odporúčame", cz: "Doporučujeme", pl: "Polecamy", de: "Wir empfehlen", en: "We recommend", hu: "Ajánljuk" },
  zacnite_pisat: { sk: "Začnite písať pre vyhľadávanie...", cz: "Začněte psát pro vyhledávání...", pl: "Zacznij pisać, aby wyszukać...", de: "Beginnen Sie zu tippen, um zu suchen...", en: "Start typing to search...", hu: "Kezdjen el gépelni a kereséshez..." },
  chyba_identifikacia: { sk: "Nepodarilo sa identifikovať produkt.", cz: "Nepodařilo se identifikovat produkt.", pl: "Nie udało się zidentyfikować produktu.", de: "Produkt konnte nicht identifiziert werden.", en: "Failed to identify the product.", hu: "Nem sikerült azonosítani a terméket." },
  chyba_analyza: { sk: "Chyba pri analýze obrázka.", cz: "Chyba při analýze obrázku.", pl: "Błąd podczas analizy obrazu.", de: "Fehler bei der Bildanalyse.", en: "Error analyzing image.", hu: "Hiba a kép elemzésekor." },
  nepodporuje_hlas: { sk: "Vaše zariadenie nepodporuje hlasové vyhľadávanie.", cz: "Vaše zařízení nepodporuje hlasové vyhledávání.", pl: "Twoje urządzenie nie obsługuje wyszukiwania głosowego.", de: "Ihr Gerät unterstützt keine Sprachsuche.", en: "Your device does not support voice search.", hu: "Az eszköze nem támogatja a hangkeresést." },
  chyba_mikrofon: { sk: "Nepodarilo sa spustiť mikrofón.", cz: "Nepodařilo se spustit mikrofon.", pl: "Nie udało się uruchomić mikrofonu.", de: "Fehler beim Starten des Mikrofons.", en: "Failed to start microphone.", hu: "Nem sikerült elindítani a mikrofont." }
};
const LOCALE_PREFIXES = {
  cz: "cz",
  de: "de",
  hu: "hu",
  en: "en",
  pl: "pl",
  sk: "sk"
};
const getLocaleFromRoute = () => {
  try {
    const route = useRoute();
    const path = route.path || "/";
    const match = path.match(/^\/([a-z]{2})(\/|$)/);
    const prefix = match?.[1];
    if (prefix && LOCALE_PREFIXES[prefix]) return LOCALE_PREFIXES[prefix];
    return "sk";
  } catch {
    return "sk";
  }
};
const useStaticTranslations = () => {
  const t = (key) => {
    const translationsForCode = TRANSLATIONS[key];
    if (!translationsForCode) return key;
    const currentLang = getLocaleFromRoute();
    return translationsForCode[currentLang] || translationsForCode["sk"] || key;
  };
  return { t, translated: ref(TRANSLATIONS), TRANSLATIONS };
};

export { useStaticTranslations as u };
