import { z } from 'zod'

// ── Supported countries ──
export const SUPPORTED_COUNTRIES = [
  { code: 'SK', name: 'Slovensko', phonePrefix: '+421', phoneLengthAfterPrefix: 9 },
  { code: 'CZ', name: 'Česko', phonePrefix: '+420', phoneLengthAfterPrefix: 9 },
  { code: 'HU', name: 'Maďarsko', phonePrefix: '+36', phoneLengthAfterPrefix: [8, 9] },
  { code: 'AT', name: 'Rakúsko', phonePrefix: '+43', phoneLengthAfterPrefix: [10, 11] },
  { code: 'PL', name: 'Poľsko', phonePrefix: '+48', phoneLengthAfterPrefix: 9 },
  { code: 'DE', name: 'Nemecko', phonePrefix: '+49', phoneLengthAfterPrefix: [10, 11] },
] as const

export type CountryCode = (typeof SUPPORTED_COUNTRIES)[number]['code']

// ── Phone validation by country ──
const phonePatterns: Record<CountryCode, RegExp> = {
  SK: /^(\+421|00421|0)?[0-9]\d{8}$/,
  CZ: /^(\+420|00420|0)?[0-9]\d{8}$/,
  HU: /^(\+36|0036|06)?\d{8,9}$/,
  AT: /^(\+43|0043|0)?\d{10,11}$/,
  PL: /^(\+48|0048)?\d{9}$/,
  DE: /^(\+49|0049|0)?\d{10,11}$/,
}

// ── Postal code validation by country ──
const postalCodePatterns: Record<CountryCode, { regex: RegExp; message: string }> = {
  SK: { regex: /^\d{3}\s?\d{2}$/, message: 'PSČ musí mať formát XXX XX (5 číslic)' },
  CZ: { regex: /^\d{3}\s?\d{2}$/, message: 'PSČ musí mať formát XXX XX (5 číslic)' },
  HU: { regex: /^\d{4}$/, message: 'PSČ musí mať 4 číslice' },
  AT: { regex: /^\d{4}$/, message: 'PSČ musí mať 4 číslice' },
  PL: { regex: /^\d{2}-?\d{3}$/, message: 'PSČ musí mať formát XX-XXX' },
  DE: { regex: /^\d{5}$/, message: 'PSČ musí mať 5 číslic' },
}

// ── Slovak IČO modulo 11 checksum ──
function validateSlovakIco(ico: string): boolean {
  if (ico.length !== 8) return false
  const digits = ico.split('').map(Number)
  if (digits.some(isNaN)) return false
  const weights = [11, 10, 8, 5, 3, 2]
  let sum = 0
  for (let i = 0; i < 6; i++) {
    sum += digits[i] * weights[i]
  }
  const remainder = sum % 11
  let check: number
  if (remainder === 0) check = 1
  else if (remainder === 1) check = 0
  else check = 11 - remainder
  const expected = digits[6] * 10 + digits[7]
  return expected === check
}

// ── Czech IČO modulo 11 checksum ──
function validateCzechIco(ico: string): boolean {
  if (ico.length !== 8) return false
  const digits = ico.split('').map(Number)
  if (digits.some(isNaN)) return false
  const weights = [8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 7; i++) {
    sum += digits[i] * weights[i]
  }
  const remainder = sum % 11
  let check: number
  if (remainder === 0) check = 1
  else if (remainder === 1) check = 0
  else check = 11 - remainder
  return digits[7] === check
}

// ── DIČ format by country ──
const dicPatterns: Record<string, { regex: RegExp; message: string }> = {
  SK: { regex: /^\d{10}$/, message: 'DIČ musí mať 10 číslic' },
  CZ: { regex: /^\d{8,10}$/, message: 'DIČ musí mať 8–10 číslic' },
}

// ── IČ DPH format by country ──
const icDphPatterns: Record<string, { regex: RegExp; message: string }> = {
  SK: { regex: /^SK\d{10}$/i, message: 'IČ DPH musí mať formát SK + 10 číslic (napr. SK2012345678)' },
  CZ: { regex: /^CZ\d{8,10}$/i, message: 'IČ DPH musí mať formát CZ + 8–10 číslic (napr. CZ12345678)' },
}

// ── Email domain validation ──
const suspiciousTlds = /\.(test|example|invalid|localhost)$/i
const emailSchema = z
  .string({ required_error: 'E-mailová adresa je povinná' })
  .min(1, 'E-mailová adresa je povinná')
  .email('Zadajte platný e-mail')
  .refine(
    (email) => {
      const domain = email.split('@')[1]
      if (!domain) return false
      if (suspiciousTlds.test(domain)) return false
      if (!domain.includes('.')) return false
      const tld = domain.split('.').pop()
      return !!tld && tld.length >= 2
    },
    'Zadajte platnú e-mailovú doménu',
  )

export const checkoutAddressSchema = z
  .object({
    email: emailSchema,
    phone: z
      .string({ required_error: 'Telefónne číslo je povinné' })
      .min(1, 'Telefónne číslo je povinné'),
    firstName: z
      .string({ required_error: 'Meno je povinné' })
      .min(1, 'Meno je povinné')
      .min(2, 'Meno musí mať aspoň 2 znaky')
      .transform((v) => v.trim()),
    lastName: z
      .string({ required_error: 'Priezvisko je povinné' })
      .min(1, 'Priezvisko je povinné')
      .min(2, 'Priezvisko musí mať aspoň 2 znaky')
      .transform((v) => v.trim()),
    address: z
      .string({ required_error: 'Adresa je povinná' })
      .min(1, 'Adresa je povinná')
      .min(5, 'Zadajte úplnú adresu (ulica a číslo)')
      .transform((v) => v.trim()),
    city: z
      .string({ required_error: 'Mesto je povinné' })
      .min(1, 'Mesto je povinné')
      .min(2, 'Zadajte platný názov mesta')
      .transform((v) => v.trim()),
    postalCode: z
      .string({ required_error: 'PSČ je povinné' })
      .min(1, 'PSČ je povinné'),
    country: z
      .string({ required_error: 'Krajina je povinná' })
      .min(1, 'Krajina je povinná'),
    isBusiness: z.boolean().default(false),
    companyName: z.string().default(''),
    ico: z.string().default(''),
    dic: z.string().default(''),
    icDph: z.string().default(''),
  })
  .superRefine((data, ctx) => {
    const countryCode = data.country as CountryCode

    // ── Phone validation by country ──
    const cleanPhone = data.phone.replace(/[\s-]/g, '')
    const pattern = phonePatterns[countryCode]
    if (pattern) {
      if (!pattern.test(cleanPhone)) {
        const countryInfo = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'],
          message: `Zadajte platné telefónne číslo pre ${countryInfo?.name ?? countryCode} (napr. ${countryInfo?.phonePrefix ?? ''}...)`,
        })
      }
    } else {
      if (!/^[+]?[\d]{7,15}$/.test(cleanPhone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'],
          message: 'Zadajte platné telefónne číslo (7–15 číslic)',
        })
      }
    }

    // ── Postal code validation by country ──
    const cleanPostal = data.postalCode.replace(/\s/g, '')
    const postalRule = postalCodePatterns[countryCode]
    if (postalRule) {
      if (!postalRule.regex.test(data.postalCode) && !postalRule.regex.test(cleanPostal)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['postalCode'], message: postalRule.message })
      }
    } else {
      if (!/^\d{4,6}$/.test(cleanPostal)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['postalCode'], message: 'Zadajte platné PSČ' })
      }
    }

    // ── Business fields ──
    if (!data.isBusiness) return

    if (!data.companyName.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyName'], message: 'Názov firmy je povinný' })
    }

    // ── IČO with checksum ──
    const cleanIco = data.ico.replace(/[\s]/g, '')
    if (!cleanIco) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['ico'], message: 'IČO je povinné' })
    } else if (!/^\d{6,8}$/.test(cleanIco)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['ico'], message: 'IČO musí obsahovať 6–8 číslic' })
    } else if (countryCode === 'SK' && cleanIco.length === 8) {
      if (!validateSlovakIco(cleanIco)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['ico'], message: 'Neplatné IČO — kontrolný súčet nesedí' })
      }
    } else if (countryCode === 'CZ' && cleanIco.length === 8) {
      if (!validateCzechIco(cleanIco)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['ico'], message: 'Neplatné IČO — kontrolný součet nesedí' })
      }
    }

    // ── DIČ format by country ──
    const cleanDic = data.dic.replace(/[\s]/g, '')
    if (!cleanDic) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['dic'], message: 'DIČ je povinné' })
    } else {
      const dicRule = dicPatterns[countryCode]
      if (dicRule && !dicRule.regex.test(cleanDic)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['dic'], message: dicRule.message })
      }
    }

    // ── IČ DPH format by country (optional field) ──
    const cleanIcDph = data.icDph.replace(/[\s]/g, '')
    if (cleanIcDph) {
      const icDphRule = icDphPatterns[countryCode]
      if (icDphRule && !icDphRule.regex.test(cleanIcDph)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['icDph'], message: icDphRule.message })
      } else if (!icDphRule) {
        if (!/^[A-Z]{2}\d{8,12}$/i.test(cleanIcDph)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['icDph'], message: 'IČ DPH musí mať formát: kód krajiny + číslo (napr. SK2012345678)' })
        }
      }
    }
  })

export const checkoutShippingSchema = z.object({
  shipping: z.enum(['gls', 'packeta', 'post', 'express']),
})

export const checkoutPaymentSchema = z.object({
  payment: z.enum(['card', 'transfer', 'cod']),
})

export type CheckoutAddressValues = z.input<typeof checkoutAddressSchema>
export type CheckoutShippingValues = z.infer<typeof checkoutShippingSchema>
export type CheckoutPaymentValues = z.infer<typeof checkoutPaymentSchema>
