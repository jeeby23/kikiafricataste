'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { HelpCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useCartStore } from '@/store/cartStore'
import { Truck, Package } from 'lucide-react'
import { createOrder } from '@/features/orders/orders.api'
import { toast } from 'sonner'
import { calculateDeliveryFee } from '@/lib/format'

export default function CheckoutPage() {
  const router = useRouter()
  const { items: cartItems, clearCart } = useCartStore()

  const [deliveryMethod, setDeliveryMethod] = useState<'ship' | 'pickup'>('ship')
  const [discount, setDiscount] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    recipientPhone: '',
    whatsappPhone: '',
    address: '',
    city: '',
    postalCode: '',
    state: 'Greater London',
    saveInfo: false,
  })

  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)

  const totalWeightKg = cartItems
    .filter((item) => item.pricingType === 'PER_KG')
    .reduce((sum, item) => sum + item.qty, 0)

  const deliveryFeePence = deliveryMethod === 'ship' ? calculateDeliveryFee(totalWeightKg) : 0
  const deliveryFee = deliveryFeePence / 100

  const total = deliveryMethod === 'pickup' ? subtotal : subtotal + deliveryFee

  const handleInputChange = (key: keyof typeof form, value: string | boolean) => {
    setForm((p) => ({ ...p, [key]: value }))
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }))
  }

  const validateForm = () => {
    const newErrors: Partial<typeof form> = {}
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    if (!form.whatsappPhone.trim()) newErrors.whatsappPhone = 'WhatsApp number is required'
    if (!form.recipientPhone.trim()) newErrors.recipientPhone = 'Recipient phone is required'
    if (deliveryMethod === 'ship') {
      if (!form.address.trim()) newErrors.address = 'Address is required'
      if (!form.city.trim()) newErrors.city = 'City is required'
      if (!form.postalCode.trim()) newErrors.postalCode = 'Postal code is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!validateForm()) return

  setIsSubmitting(true)

  try {
    const payload = {
      customerName: `${form.firstName} ${form.lastName}`.trim(),
      customerEmail: form.email.trim(),
      customerWhatsapp: form.whatsappPhone || form.recipientPhone,
      deliveryAddress: deliveryMethod === 'pickup' ? 'Store Pickup' : form.address.trim(),
      deliveryPostCode: deliveryMethod === 'pickup' ? 'PICKUP' : form.postalCode.trim(),
      deliveryCity: deliveryMethod === 'pickup' ? 'Store' : form.city.trim(),
      deliveryState: deliveryMethod === 'pickup' ? 'Pickup' : form.state,
      notes: '',
      items: cartItems.map((item) => ({
        productId: item.id,
        pricingType: item.pricingType || 'FIXED',
        quantity: item.pricingType === 'FIXED' ? item.qty : undefined,
        weightKg: item.pricingType === 'PER_KG' ? item.qty : undefined,
      })),
    }

    const res = await createOrder(payload)

    // Handle structured error returned from API
    if (res?.error) {
      toast.error(res.error)
      return
    }

    // Additional safety for different possible response shapes
    if (res?.data?.error) {
      toast.error(res.data.error)
      return
    }

    const orderNumber = res.data?.orderNumber || res.data?.id
    if (!orderNumber) {
      toast.error('Server did not return order number')
      return
    }

    // ... rest of your success logic (unchanged)
    const orderData = {
      orderNumber,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerWhatsapp: payload.customerWhatsapp,
      deliveryAddress: payload.deliveryAddress,
      deliveryCity: payload.deliveryCity,
      deliveryState: payload.deliveryState,
      deliveryPostCode: payload.deliveryPostCode,
      items: cartItems,
      subtotal: res.data.subtotal,
      deliveryFee: res.data.deliveryFee,
      total: res.data.total,
      expiresAt: res.data.expiresAt,
    }
console.log( "orderdata",orderData.deliveryFee)
    localStorage.setItem(`order_${orderNumber}`, JSON.stringify(orderData))
    clearCart()
    toast.success('Order placed successfully! 🎉')
    router.push(`/checkout/${orderNumber}`)
  } catch (error: any) {
    console.error('Checkout Error:', error)

    // Enhanced error extraction for backend messages
    const errorMessage =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      error?.message ||
      'Failed to place order. Please try again.'

    toast.error(errorMessage)
  } finally {
    setIsSubmitting(false)
  }
}
  const displayItems = cartItems.length > 0 ? cartItems : []

  return (
    <div className="min-h-auto bg-white text-[#333333] font-sans antialiased ">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_42%] min-h-[calc(100vh-73px)] ">
        <div className="p-6 md:p-12 lg:pr-16 bg-white space-y-8">
          <form onSubmit={handleSubmit} className="max-w-[620px] ml-auto w-full space-y-7">

            {/* Contact */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-medium text-gray-900">Contact</h2>
              </div>
              <div className="space-y-1">
                <Input
                  type="text"
                  placeholder="Mobile number of recipient"
                  value={form.recipientPhone}
                  onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                  className={`h-11 rounded-md border-gray-300 shadow-none text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-400 ${errors.recipientPhone ? 'border-red-500' : ''}`}
                />
                {errors.recipientPhone && (
                  <p className="text-xs text-red-500 mt-1">{errors.recipientPhone}</p>
                )}
              </div>
            </div>

            {/* Delivery Tabs */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Delivery</h2>
              <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('ship')}
                  className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition ${deliveryMethod === 'ship' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
                >
                  <Truck className="w-5 h-5" />
                  Ship
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition ${deliveryMethod === 'pickup' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
                >
                  <Package className="w-5 h-5" />
                  Pickup
                </button>
              </div>
            </div>

            {/* Address fields */}
            {deliveryMethod === 'ship' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-normal">Country/Region</label>
                  <Select defaultValue="GBP">
                    <SelectTrigger className="w-full h-11 border-gray-300 rounded-md focus:ring-0 focus:ring-offset-0 text-sm text-gray-700">
                      <SelectValue placeholder="United Kingdom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GBP">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      placeholder="Your name"
                      value={form.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`h-11 rounded-md border-gray-300 shadow-none text-sm placeholder:text-gray-400 ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`h-11 rounded-md border-gray-300 shadow-none text-sm placeholder:text-gray-400 ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Input
                    placeholder="Address you are sending package to"
                    value={form.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`h-11 rounded-md border-gray-300 shadow-none text-sm placeholder:text-gray-400 ${errors.address ? 'border-red-500' : ''}`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <Input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`h-11 rounded-md border-gray-300 shadow-none text-sm placeholder:text-gray-400 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-[1fr_1fr_1fr] gap-3">
                  <div>
                    <Input
                      placeholder="City"
                      value={form.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`h-11 rounded-md border-gray-300 shadow-none text-sm placeholder:text-gray-400 ${errors.city ? 'border-red-500' : ''}`}
                    />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Input
                      placeholder="Postal code"
                      value={form.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className={`h-11 rounded-md border-gray-300 shadow-none text-sm placeholder:text-gray-400 ${errors.postalCode ? 'border-red-500' : ''}`}
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp + Save */}
            <div className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Your phone number for whatsapp order updates"
                  value={form.whatsappPhone}
                  onChange={(e) => handleInputChange('whatsappPhone', e.target.value)}
                  className="h-11 rounded-md border-gray-300 shadow-none text-sm placeholder:text-gray-400 pr-10"
                />
                <HelpCircle className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" />
              </div>

              <div className="flex items-center space-x-2 py-1">
                <Checkbox
                  id="saveInfo"
                  checked={form.saveInfo}
                  onCheckedChange={(checked: boolean | 'indeterminate') =>
                    handleInputChange('saveInfo', !!checked)
                  }
                  className="rounded border-gray-300 text-[#8c7654] focus:ring-[#8c7654] w-4 h-4 shadow-none"
                />
                <label
                  htmlFor="saveInfo"
                  className="text-xs font-normal text-gray-600 cursor-pointer select-none"
                >
                  Save this information for next time
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition mt-4 shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Processing Order...
                </div>
              ) : (
                'Complete Order'
              )}
            </Button>
          </form>
        </div>

        <div className="bg-[#fff9f9] p-6 md:p-12 lg:pl-12 border-l border-gray-100">
          <div className="max-w-[440px] mr-auto w-full space-y-6">

            <div className="space-y-4">
              {displayItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-[64px] h-[64px] bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <span className="absolute bg-gray-500 text-white text-[11px] font-medium w-[20px] h-[20px] rounded-full flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-gray-400 font-normal">{item.detail}</p>
                    </div>
                  </div>
                  {/* item.price is in pounds — display directly */}
                  <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">
                    £{(item.price * item.qty).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="flex gap-2 pt-2">
              <Input
                placeholder="Discount code or gift card"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="h-10 rounded-md border-gray-300 bg-white shadow-none text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400"
              />
              <Button
                type="button"
                onClick={() => discount && setDiscountApplied(true)}
                className="h-10 px-4 bg-[#f5e6e6] hover:bg-[#ebd7d7] text-gray-700 text-xs font-medium rounded-md shadow-none transition"
              >
                Apply
              </Button>
            </div>
            {discountApplied && (
              <p className="text-xs text-green-600 -mt-2">Promo code applied successfully.</p>
            )}

            {/* Breakdown */}
            <div className="space-y-2.5 pt-2 text-xs text-gray-600 font-normal">
              <div className="flex justify-between">
                <span>Subtotal • {displayItems.reduce((acc, i) => acc + i.qty, 0)} items</span>
                <span className="font-semibold text-gray-900">
                  £{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900 text-xs italic text-gray-400">
                  {deliveryMethod === 'pickup'
                    ? 'Free'
                    : totalWeightKg === 0
                      ? '—'
                      : `£${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {deliveryMethod === 'ship' && totalWeightKg > 0 && (
                <p className="text-[11px] text-gray-400">
                  Based on {totalWeightKg.toFixed(1)}kg total weight
                </p>
              )}
            </div>

            <div className="border-t border-gray-200/60 pt-4 flex justify-between items-baseline">
              <span className="text-base font-semibold text-gray-900">Total</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] text-gray-400 font-normal">GBP</span>
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  £{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}