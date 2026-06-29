/**
 * Checkout form validation — country-aware, závislé od ISO kódu krajiny.
 * Pure funkcie (bez Vue) — používa sa v DeliveryStep.vue (inline UX)
 * aj v useCheckoutFlow.ts (gating CTA buttonu). Single source of truth.
 *
 * Návrat: prázdny string '' = OK, inak chybová hláška (SK).
 */

export const MAX_NAME_LEN = 35;     // meno + priezvisko (kuriérsky štítok)
export const MAX_COMPANY_LEN = 35;  // názov firmy (kuriérsky štítok)

const strip = (v: string) => (v || '').replace(/[\s\-()/.]/g, '');

// ── PSČ podľa krajiny ──────────────────────────────────────────────────────
const ZIP_RULES: Record<string, { re: RegExp; example: string }> = {
  SK: { re: /^\d{3}\s?\d{2}$/, example: '029 51' },
  CZ: { re: /^\d{3}\s?\d{2}$/, example: '100 00' },
  PL: { re: /^\d{2}-?\d{3}$/, example: '00-001' },
  HU: { re: /^\d{4}$/, example: '1011' },
  AT: { re: /^\d{4}$/, example: '1010' },
  DE: { re: /^\d{5}$/, example: '10115' },
};
const ZIP_DEFAULT = { re: /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/, example: '' };

// ── Telefón podľa krajiny (po odstránení medzier/pomlčiek) ──────────────────
const PHONE_RULES: Record<string, RegExp> = {
  SK: /^(\+421|00421|0)\d{9}$/,
  CZ: /^(\+420|00420|0)?\d{9}$/,
  PL: /^(\+48|0048)?\d{9}$/,
  HU: /^(\+36|0036|06)?\d{8,9}$/,
  AT: /^(\+43|0043|0)\d{6,13}$/,
  DE: /^(\+49|0049|0)\d{6,13}$/,
};
const PHONE_DEFAULT = /^\+?\d{7,15}$/;

export function zipExample(iso?: string): string {
  return (ZIP_RULES[(iso || '').toUpperCase()] || ZIP_DEFAULT).example;
}

// ── Názvy firemných identifikátorov podľa krajiny ──────────────────────────
// SK je referenčné; v CZ/PL/... pridávame lokálny ekvivalent do zátvorky.
const COMPANY_LABELS: Record<string, { ico: string; dic: string; vat: string }> = {
  SK: { ico: 'IČO',           dic: 'DIČ',        vat: 'IČ DPH' },
  CZ: { ico: 'IČO',           dic: 'DIČ',        vat: 'IČ DPH (DIČ)' },
  PL: { ico: 'IČO (REGON)',   dic: 'DIČ (NIP)',  vat: 'IČ DPH (NIP)' },
  HU: { ico: 'IČO',           dic: 'DIČ',        vat: 'IČ DPH (ANUM)' },
  DE: { ico: 'IČO',           dic: 'DIČ',        vat: 'IČ DPH (USt-IdNr)' },
  AT: { ico: 'IČO',           dic: 'DIČ',        vat: 'IČ DPH (UID)' },
};
const COMPANY_LABELS_DEFAULT = { ico: 'IČO', dic: 'DIČ', vat: 'IČ DPH' };

export function companyLabel(field: 'ico' | 'dic' | 'vat', iso?: string): string {
  return (COMPANY_LABELS[(iso || '').toUpperCase()] || COMPANY_LABELS_DEFAULT)[field];
}

export function validateEmail(v: string): string {
  const val = (v || '').trim();
  if (!val) return 'Zadajte e-mail.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Neplatný formát e-mailu.';
  return '';
}

export function validatePhone(v: string, iso?: string): string {
  const val = (v || '').trim();
  if (!val) return 'Zadajte telefónne číslo.';
  const cleaned = strip(val);
  const re = PHONE_RULES[(iso || '').toUpperCase()] || PHONE_DEFAULT;
  if (!re.test(cleaned)) return 'Neplatné telefónne číslo pre zvolenú krajinu.';
  return '';
}

export function validateZip(v: string, iso?: string): string {
  const val = (v || '').trim();
  if (!val) return 'Zadajte PSČ.';
  const rule = ZIP_RULES[(iso || '').toUpperCase()] || ZIP_DEFAULT;
  if (!rule.re.test(val)) {
    return rule.example ? `Neplatné PSČ (napr. ${rule.example}).` : 'Neplatné PSČ.';
  }
  return '';
}

export function validateStreet(v: string): string {
  const val = (v || '').trim();
  if (!val) return 'Zadajte ulicu a číslo.';
  if (val.length < 3) return 'Príliš krátka adresa.';
  if (val.length > 60) return 'Adresa je príliš dlhá (max 60).';
  return '';
}

export function validateCity(v: string): string {
  const val = (v || '').trim();
  if (!val) return 'Zadajte mesto.';
  if (val.length < 2) return 'Príliš krátky názov mesta.';
  return '';
}

/** Meno + priezvisko spolu ≤ 35 znakov (kuriérsky štítok). */
export function validateFullName(first: string, last: string): string {
  const f = (first || '').trim();
  const l = (last || '').trim();
  if (!f) return 'Zadajte meno.';
  if (!l) return 'Zadajte priezvisko.';
  if ((`${f} ${l}`).length > MAX_NAME_LEN) {
    return `Meno a priezvisko spolu max ${MAX_NAME_LEN} znakov (kuriér).`;
  }
  return '';
}

export function validateCompany(v: string): string {
  const val = (v || '').trim();
  if (!val) return 'Zadajte názov firmy.';
  if (val.length > MAX_COMPANY_LEN) return `Názov firmy max ${MAX_COMPANY_LEN} znakov (kuriér).`;
  return '';
}

/** IČO — SK/CZ = 8 číslic. Iné krajiny: nepovinný formát. */
export function validateIco(v: string, iso?: string): string {
  const val = strip(v || '');
  if (!val) return 'Zadajte IČO.';
  const code = (iso || '').toUpperCase();
  if ((code === 'SK' || code === 'CZ') && !/^\d{8}$/.test(val)) {
    return 'IČO musí mať 8 číslic.';
  }
  if (!/^\d{6,12}$/.test(val)) return 'Neplatné IČO.';
  return '';
}

/** DIČ — nepovinné. SK = 10 číslic, CZ = 8–10 číslic. Validuj len ak vyplnené. */
export function validateDic(v: string, iso?: string): string {
  const val = strip(v || '');
  if (!val) return '';
  const code = (iso || '').toUpperCase();
  if (code === 'SK' && !/^\d{10}$/.test(val)) return 'DIČ musí mať 10 číslic.';
  if (code === 'CZ' && !/^\d{8,10}$/.test(val)) return 'DIČ musí mať 8–10 číslic.';
  if (!/^\d{8,12}$/.test(val)) return 'Neplatné DIČ.';
  return '';
}

/**
 * IČ DPH — formátová kontrola (VIES robí autoritatívne overenie).
 * Formát: 2 písmená krajiny + 8–12 číslic, napr. SK2020123456.
 */
export function validateVatFormat(v: string, iso?: string): string {
  const val = strip(v || '').toUpperCase();
  if (!val) return 'Zadajte IČ DPH.';
  if (!/^[A-Z]{2}\d{8,12}$/.test(val)) return 'Formát: napr. SK2020123456.';
  const code = (iso || '').toUpperCase();
  if (code && /^[A-Z]{2}/.test(val) && !val.startsWith(code)) {
    return `IČ DPH má začínať kódom ${code}.`;
  }
  return '';
}

export interface ShippingLike {
  firstName: string; lastName: string; email: string; phone: string;
  street: string; city: string; zipcode: string; countryId: string;
  company?: string; ico?: string; dic?: string; icdph?: string;
}

export interface BillingLike {
  firstName: string; lastName: string;
  street: string; city: string; zipcode: string; countryId: string;
}

/**
 * Skompletizuje chyby pre celý shipping formulár.
 * @param iso ISO kód krajiny doručenia (z countryId)
 * @param isCompany validuj aj firemné polia
 */
export function validateShippingForm(
  form: ShippingLike,
  iso: string,
  isCompany: boolean,
): Record<string, string> {
  const e: Record<string, string> = {};
  const email = validateEmail(form.email);     if (email) e.email = email;
  const phone = validatePhone(form.phone, iso); if (phone) e.phone = phone;
  const name = validateFullName(form.firstName, form.lastName);
  if (name) {
    if (!form.firstName?.trim()) e.firstName = name;
    else if (!form.lastName?.trim()) e.lastName = name;
    else e.lastName = name; // dĺžka → ukáž pri priezvisku
  }
  if (!form.countryId) e.countryId = 'Vyberte krajinu.';
  const street = validateStreet(form.street); if (street) e.street = street;
  const city = validateCity(form.city);       if (city) e.city = city;
  const zip = validateZip(form.zipcode, iso); if (zip) e.zipcode = zip;

  if (isCompany) {
    const vat = validateVatFormat(form.icdph || '', iso); if (vat) e.icdph = vat;
    const comp = validateCompany(form.company || '');     if (comp) e.company = comp;
    const ico = validateIco(form.ico || '', iso);         if (ico) e.ico = ico;
    const dic = validateDic(form.dic || '', iso);         if (dic) e.dic = dic;
  }
  return e;
}

/** Billing (iná fakturačná adresa) — meno, adresa, PSČ podľa billing krajiny. */
export function validateBillingForm(form: BillingLike, iso: string): Record<string, string> {
  const e: Record<string, string> = {};
  const name = validateFullName(form.firstName, form.lastName);
  if (name) {
    if (!form.firstName?.trim()) e.firstName = name;
    else e.lastName = name;
  }
  if (!form.countryId) e.countryId = 'Vyberte krajinu.';
  const street = validateStreet(form.street); if (street) e.street = street;
  const city = validateCity(form.city);       if (city) e.city = city;
  const zip = validateZip(form.zipcode, iso); if (zip) e.zipcode = zip;
  return e;
}
