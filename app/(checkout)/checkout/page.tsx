'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HelpCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useCartStore } from '@/store/cartStore'

export default function CheckoutPage() {
  const router = useRouter()
  const { items: cartItems, clearCart } = useCartStore()

  const [deliveryMethod, setDeliveryMethod] = useState<'ship' | 'pickup'>('ship')
  const [shippingCost, setShippingCost] = useState<number>(3.00)
  const [discount, setDiscount] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)

  const [form, setForm] = useState({
    recipientPhone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: 'Lagos',
    postalCode: '',
    whatsappPhone: '',
    saveInfo: false,
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)

  // Fallback demo items mapped to match your shop's structure but using your custom Pounds currency layout
  const displayItems = cartItems.length > 0 ? cartItems : [
    {
      id: 'item-1',
      name: 'B.Sen DB6 (3.5 yards)',
      detail: 'Brown / Senator',
      price: 15.75,
      qty: 1,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=150&auto=format&fit=crop'
    },
    {
      id: 'item-2',
      name: 'BC56 - Price is for 3.5yards',
      detail: 'Green - Aqua / Chantilly',
      price: 17.00,
      qty: 3,
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=150&auto=format&fit=crop'
    }
  ]

  const computedSubtotal = cartItems.length > 0 ? subtotal : 66.75
  const computedTotal = computedSubtotal + (deliveryMethod === 'ship' ? shippingCost : 0)

  const handleInputChange = (key: keyof typeof form, value: string | boolean) => {
    setForm((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: '' }))
  }

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.recipientPhone.trim()) e.recipientPhone = 'Recipient phone number is required'
    if (deliveryMethod === 'ship') {
      if (!form.firstName.trim()) e.firstName = 'First name is required'
      if (!form.lastName.trim()) e.lastName = 'Last name is required'
      if (!form.address.trim()) e.address = 'Address is required'
      if (!form.city.trim()) e.city = 'City is required'
    }
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    const orderId = 'MAFOTT-' + Date.now().toString().slice(-8)
    const orderData = {
      id: orderId,
      ...form,
      deliveryMethod,
      shippingCost: deliveryMethod === 'ship' ? shippingCost : 0,
      items: displayItems,
      subtotal: computedSubtotal,
      total: computedTotal,
      currency: 'GBP',
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData))
    clearCart()
    router.push(`/checkout/${orderId}`)
  }

  return (
    <div className="min-h-screen bg-white text-[#333333] font-sans antialiased">
     
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_42%] min-h-[calc(100vh-73px)]">
        <div className="p-6 md:p-12 lg:pr-16 bg-white space-y-8">
          <form onSubmit={handleSubmit} className="max-w-[620px] ml-auto w-full space-y-7">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-medium text-gray-900">Contact</h2>
                {/* <Link href="/signin" className="text-xs text-[#8c7654] underline hover:text-black transition">
                  Sign in
                </Link> */}
              </div>
              <div className="space-y-1">
                <Input 
                  type="text" 
                  placeholder="Mobile number of recipient" 
                  value={form.recipientPhone}
                  onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                  className={`h-11 rounded-md border-gray-300 shadow-none text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-400 ${errors.recipientPhone ? 'border-red-500' : ''}`}
                />
                {errors.recipientPhone && <p className="text-xs text-red-500 mt-1">{errors.recipientPhone}</p>}
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25c0-.442-.18-.846-.474-1.137l-3.36-3.36a1.5 1.5 0 0 0-1.06-.44H13.5m.125 12.25V14.25m0 0V9.75M13.5 9.75V3.375c0-.621-.504-1.125-1.125-1.125h-5.25A1.125 1.125 0 0 0 6 3.375V14.25m12 0H13.5" />
                  </svg>
                  Ship
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition ${deliveryMethod === 'pickup' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                  </svg>
                  Pickup
                </button>
              </div>
            </div>

            {/* Address Information fields */}
            {deliveryMethod === 'ship' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-normal">Country/Region</label>
                  <Select defaultValue="NG">
                    <SelectTrigger className="w-full h-11 border-gray-300 rounded-md focus:ring-0 focus:ring-offset-0 text-sm">
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
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Input 
                      placeholder="Last name" 
                      value={form.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`h-11 rounded-md border-gray-300 shadow-none text-sm placeholder:text-gray-400 ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
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
                  {/* <div>
                    <Select defaultValue="Lagos" onValueChange={(val: string) => handleInputChange('state', val)}>
                      <SelectTrigger className="w-full h-11 border-gray-300 rounded-md text-sm text-gray-700">
                        <span className="text-gray-400 text-xs block text-left font-normal leading-tight">State</span>
                        <span className="-mt-1 block text-left">Lagos</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lagos">Lagos</SelectItem>
                        <SelectItem value="Abuja">Abuja</SelectItem>
                        <SelectItem value="Oyo">Oyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                  <div>
                    <Input 
                      placeholder="Postal code (option..." 
                      value={form.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="h-11 rounded-md border-gray-300 shadow-none text-sm placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Whatsapp Updates Field */}
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
                  onCheckedChange={(checked: boolean | 'indeterminate') => handleInputChange('saveInfo', !!checked)}
                  className="rounded border-gray-300 text-[#8c7654] focus:ring-[#8c7654] w-4 h-4 shadow-none"
                />
                <label htmlFor="saveInfo" className="text-xs font-normal text-gray-600 cursor-pointer select-none">
                  Save this information for next time
                </label>
              </div>
            </div>

            {/* Shipping Methods Section */}
            {deliveryMethod === 'ship' && (
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Shipping method</h3>
                <RadioGroup 
                  defaultValue="3.00" 
                  onValueChange={(val: string) => setShippingCost(Number(val))}
                  className="space-y-0 border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100"
                >
                  <label className={`flex items-start justify-between p-4 cursor-pointer transition ${shippingCost === 3.00 ? 'bg-[#fcf8f2] border-2 border-[#b59a6c] -m-[1px] rounded-lg relative z-10' : 'bg-white'}`}>
                    <div className="flex gap-3">
                      <RadioGroupItem value="3.00" id="ship-1" className="mt-0.5 border-gray-400 text-[#8c7654] focus:ring-0 focus:ring-offset-0" />
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-gray-900 block">Lekki, Ajah, Ikoyi (ONLY PLEASE)</span>
                        <span className="text-xs text-gray-500 font-normal block">ONLY THESE 3 ENVIRON PLEASE</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">£3.00</span>
                  </label>

                  <label className={`flex items-start justify-between p-4 cursor-pointer transition ${shippingCost === 5.00 ? 'bg-[#fcf8f2] border-2 border-[#b59a6c] -m-[1px] rounded-lg relative z-10' : 'bg-white'}`}>
                    <div className="flex gap-3">
                      <RadioGroupItem value="5.00" id="ship-2" className="mt-0.5 border-gray-400 text-[#8c7654] focus:ring-0 focus:ring-offset-0" />
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-gray-900 block">Lagos mainland</span>
                        <span className="text-xs text-gray-500 font-normal block">for standard mainland</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">£5.00</span>
                  </label>

                  <label className={`flex items-start justify-between p-4 cursor-pointer transition ${shippingCost === 7.00 ? 'bg-[#fcf8f2] border-2 border-[#b59a6c] -m-[1px] rounded-lg relative z-10' : 'bg-white'}`}>
                    <div className="flex gap-3">
                      <RadioGroupItem value="7.00" id="ship-3" className="mt-0.5 border-gray-400 text-[#8c7654] focus:ring-0 focus:ring-offset-0" />
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-gray-900 block">Lagos outskirts (Akute,Ojo, opic, Iyana ishashi, tradefair</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">£7.00</span>
                  </label>
                </RadioGroup>
              </div>
            )}

            <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition mt-4 shadow-none">
              Complete Order
            </Button>
          </form>
        </div>

        {/* ── RIGHT COLUMN: Order Summary ─────────────────────────────── */}
        <div className="bg-[#fff9f9] p-6 md:p-12 lg:pl-12 border-l border-gray-100">
          <div className="max-w-[440px] mr-auto w-full space-y-6">
            
            {/* Items List */}
            <div className="space-y-4">
              {displayItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-[64px] h-[64px] bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-gray-500 text-white text-[11px] font-medium w-[20px] h-[20px] rounded-full flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-gray-400 font-normal">{item.detail}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">
                    £{(item.price * item.qty).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
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
            {discountApplied && <p className="text-xs text-green-600 -mt-2">Promo code applied successfully.</p>}

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 pt-2 text-xs text-gray-600 font-normal">
              <div className="flex justify-between">
                <span>Subtotal • {displayItems.reduce((acc, current) => acc + current.qty, 0)} items</span>
                <span className="font-semibold text-gray-900">
                  £{computedSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">
                  {deliveryMethod === 'ship' ? `£${shippingCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'Free'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200/60 pt-4 flex justify-between items-baseline">
              <span className="text-base font-semibold text-gray-900">Total</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] text-gray-400 font-normal">GBP</span>
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  £{computedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}