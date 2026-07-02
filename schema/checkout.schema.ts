import { z } from 'zod'

export const checkoutSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters'),

    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters'),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),

    recipientPhone: z
      .string()
      .min(1, 'Recipient phone is required')
      .min(7, 'Phone number must be at least 7 digits')
      .max(20, 'Phone number is too long')
      .regex(/^[\d\s\+\-\(\)]+$/, 'Please enter a valid phone number'),

    whatsappPhone: z
      .string()
      .min(1, 'WhatsApp number is required')
      .min(7, 'WhatsApp number must be at least 7 digits')
      .max(20, 'WhatsApp number is too long')
      .regex(/^[\d\s\+\-\(\)]+$/, 'Please enter a valid WhatsApp number'),

    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    state: z.string().default('Greater London'),
    saveInfo: z.boolean().default(false),
    deliveryMethod: z.enum(['ship', 'pickup']),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === 'ship') {
      if (!data.address || data.address.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Address is required',
          path: ['address'],
        })
      } else if (data.address.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a full address',
          path: ['address'],
        })
      }

      if (!data.city || data.city.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'City is required',
          path: ['city'],
        })
      }

      if (!data.postalCode || data.postalCode.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Postal code is required',
          path: ['postalCode'],
        })
      } else if (!/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(data.postalCode.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid UK postal code',
          path: ['postalCode'],
        })
      }
    }
  })

export type CheckoutFormValues = z.infer<typeof checkoutSchema>