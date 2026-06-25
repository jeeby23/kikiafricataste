import { z } from 'zod'

export const productFormSchema = z
  .object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    pricingType: z.enum(['FIXED', 'PER_KG']),
    price: z.preprocess(
      (val) => (val === '' ? undefined : val),

      z.coerce.number().positive().optional(),
    ),
   pricePerKg: z.preprocess(

  (v) => v === '' ? undefined : v,

  z.coerce.number().positive().optional()

),
  stockQty: z.preprocess(

  (v) => v === '' ? undefined : v,

  z.coerce.number().int().min(0).optional()

),
 stockKg: z.preprocess(

  (v) => v === '' ? undefined : v,

  z.coerce.number().min(0).optional()

),
   minWeightKg: z.preprocess(

  (v) => v === '' ? undefined : v,

  z.coerce.number().positive().optional()

),
   stepWeightKg: z.preprocess(

  (v) => v === '' ? undefined : v,

  z.coerce.number().positive().optional()

),
    categoryId: z.string().optional(),
    isActive: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.pricingType === 'FIXED' && !data.price) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Price is required', path: ['price'] })
    }
    if (data.pricingType === 'PER_KG' && !data.pricePerKg) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Price per kg is required',
        path: ['pricePerKg'],
      })
    }
  })

export type FormValues = z.input<typeof productFormSchema>
