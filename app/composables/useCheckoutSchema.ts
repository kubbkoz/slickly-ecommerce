import { z } from 'zod'

const postalCodeRegex = /^\d{3}\s?\d{2}$/
const phoneRegex = /^[+]?[\d\s-]{6,}$/
const icoRegex = /^\d{6,8}$/

export const checkoutAddressSchema = z
  .object({
    email: z
      .string({ required_error: 'E-mailová adresa je povinná' })
      .min(1, 'E-mailová adresa je povinná')
      .email('Zadajte platný e-mail'),
    phone: z
      .string({ required_error: 'Telefónne číslo je povinné' })
      .min(1, 'Telefónne číslo je povinné')
      .regex(phoneRegex, 'Zadajte platné telefónne číslo'),
    firstName: z
      .string({ required_error: 'Meno je povinné' })
      .min(1, 'Meno je povinné')
      .transform((v) => v.trim()),
    lastName: z
      .string({ required_error: 'Priezvisko je povinné' })
      .min(1, 'Priezvisko je povinné')
      .transform((v) => v.trim()),
    address: z
      .string({ required_error: 'Adresa je povinná' })
      .min(1, 'Adresa je povinná')
      .transform((v) => v.trim()),
    city: z
      .string({ required_error: 'Mesto je povinné' })
      .min(1, 'Mesto je povinné')
      .transform((v) => v.trim()),
    postalCode: z
      .string({ required_error: 'PSČ je povinné' })
      .min(1, 'PSČ je povinné')
      .transform((v) => v.replace(/\s/g, ''))
      .pipe(z.string().regex(postalCodeRegex, 'PSČ musí mať 5 číslic')),
    country: z
      .string({ required_error: 'Krajina je povinná' })
      .min(1, 'Krajina je povinná')
      .transform((v) => v.trim()),
    isBusiness: z.boolean().default(false),
    companyName: z.string().default(''),
    ico: z.string().default(''),
    dic: z.string().default(''),
    icDph: z.string().default(''),
  })
  .superRefine((data, ctx) => {
    if (!data.isBusiness) return
    if (!data.companyName.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyName'], message: 'Názov firmy je povinný' })
    }
    const cleanIco = data.ico.replace(/\s/g, '')
    if (!cleanIco) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['ico'], message: 'IČO je povinné' })
    } else if (!icoRegex.test(cleanIco)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['ico'], message: 'IČO musí mať 6–8 číslic' })
    }
    if (!data.dic.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['dic'], message: 'DIČ je povinné' })
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
