import { z } from 'zod'

export const productFormSchema = z
  .object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    pricingType: z.enum(['FIXED', 'PER_KG']),
    price: z.coerce.number({ error: 'Must be a number' }).positive().optional(),
    pricePerKg: z.coerce.number({ error: 'Must be a number' }).positive().optional(),
    stockQty: z.coerce.number({ error: 'Must be a number' }).int().min(0).optional(),
    stockKg: z.coerce.number({ error: 'Must be a number' }).min(0).optional(),
    minWeightKg: z.coerce.number({ error: 'Must be a number' }).positive().optional(),
    stepWeightKg: z.coerce.number({ error: 'Must be a number' }).positive().optional(),
    categoryId: z.string().optional(),
    isActive: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.pricingType === 'FIXED' && !data.price) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Price is required', path: ['price'] })
    }
    if (data.pricingType === 'PER_KG' && !data.pricePerKg) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Price per kg is required', path: ['pricePerKg'] })
    }
  })

export type FormValues = z.input<typeof productFormSchema>