'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, Clock, ShieldCheck, ChevronRight } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'

const PICKUP_LOCATION = {
  name: 'Kiki African Taste — UK Store',
  address: '14 Brixton Market Row, Brixton, London SW9 8PR, United Kingdom',
  note: 'Usually ready within 2–4 hours',
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items: cartItems, clearCart } = useCartStore()

  const [discount, setDiscount] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [submitted, setSubmitted] = useState(false)

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)

  // Redirect to cart if empty
  if (!submitted && cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center pt-24">
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
        <Link href="/products" className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#c9a96e] hover:text-black transition">
          Shop Products
        </Link>
      </div>
    )
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }))
      setErrors((p) => ({ ...p, [key]: '' }))
    },
  })

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address'
    if (!form.phone.match(/^(\+44|0)[\d\s]{9,13}$/)) e.phone = 'Enter a valid UK phone number'
    if (!form.address.trim()) e.address = 'Home address is required'
    if (!form.postcode.match(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i)) e.postcode = 'Enter a valid UK postcode'
    return e
  }
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const errs = validate();
  if (Object.keys(errs).length) {
    setErrors(errs);
    return;
  }

  const orderId = "KIKI-" + Date.now().toString().slice(-8);

  const orderData = {
    id: orderId,
    firstName: form.firstName,
    email: form.email,
    phone: form.phone,
    address: form.address,
    items: cartItems,
    createdAt: new Date().toISOString(),
  };

  // Save to localStorage
  localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));

  clearCart();
  router.push(`/checkout/${orderId}`);
};

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <ShieldCheck size={32} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Order Placed!</h1>
        <p className="text-gray-500 max-w-sm">
          Thank you, <strong>{form.firstName}</strong>. Your order is confirmed for pickup at our Brixton store.
          We'll contact you on <strong>{form.phone}</strong> when it's ready.
        </p>
        <Link href="/" className="bg-black text-white px-8 py-3 rounded-xl font-semibold tracking-wide hover:bg-[#c9a96e] hover:text-black transition">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] text-black pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-10">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <ChevronRight size={12} />
          <button onClick={() => router.back()} className="hover:text-black transition">Cart</button>
          <ChevronRight size={12} />
          <span className="text-black font-medium">Checkout</span>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">

            {/* ── LEFT ─────────────────────────────────────────────────────── */}
            <div className="space-y-10">

              {/* Contact */}
              <section>
                <h2 className="text-xl font-bold mb-5 text-black">Contact</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-black">First Name</Label>
                      <Input id="firstName" placeholder="e.g. Amaka" {...field('firstName')}
                        className={errors.firstName ? 'border-red-400 focus-visible:ring-red-300' : ''} />
                      {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-black">Last Name</Label>
                      <Input id="lastName" placeholder="e.g. Okafor" {...field('lastName')}
                        className={errors.lastName ? 'border-red-400 focus-visible:ring-red-300' : ''} />
                      {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-black">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" {...field('email')}
                      className={errors.email ? 'border-red-400 focus-visible:ring-red-300' : ''} />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-black">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+44 7700 900000" {...field('phone')}
                      className={errors.phone ? 'border-red-400 focus-visible:ring-red-300' : ''} />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </div>
              </section>

              {/* Delivery */}
              <section>
                <h2 className="text-xl font-bold mb-2 text-black">Delivery</h2>
                <p className="text-sm text-gray-500 mb-4">We currently only offer in-store pickup at our UK location.</p>
                <div className="border-2 border-[#c9a96e] rounded-xl p-5 bg-white space-y-3">
                  <div className="flex items-center gap-2 text-[#c9a96e] font-semibold text-sm">
                    <MapPin size={16} /> Pickup — FREE
                  </div>
                  <p className="font-semibold text-gray-900">{PICKUP_LOCATION.name}</p>
                  <p className="text-sm text-gray-500">{PICKUP_LOCATION.address}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock size={13} /> {PICKUP_LOCATION.note}
                  </div>
                </div>
              </section>

              {/* Address */}
              <section>
                <h2 className="text-xl font-bold mb-5 text-black">Your Address</h2>
                <p className="text-sm text-gray-500 mb-4">So we can confirm your identity and send order updates.</p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-black">Country / Region</Label>
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-sm text-gray-500 cursor-not-allowed select-none">
                      🇬🇧 United Kingdom
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-black">Home Address</Label>
                    <Input id="address" placeholder="e.g. 12 Coldharbour Lane, Brixton" {...field('address')}
                      className={errors.address ? 'border-red-400 focus-visible:ring-red-300' : ''} />
                    {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                  </div>
                  <div className="space-y-1.5 max-w-xs">
                    <Label htmlFor="postcode" className="text-black">Postcode</Label>
                    <Input id="postcode" placeholder="e.g. SW9 8PR" {...field('postcode')}
                      className={errors.postcode ? 'border-red-400 focus-visible:ring-red-300 text-black' : ''} />
                    {errors.postcode && <p className="text-xs text-red-500">{errors.postcode}</p>}
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="text-xl font-bold mb-1 text-black">Payment</h2>
                <p className="text-sm text-gray-400 mb-4 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-green-500" />
                  All transactions are secure and encrypted.
                </p>
                <div className="border-2 border-[#c9a96e] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 bg-[#fdf6ec] font-semibold text-gray-800 flex items-center gap-2">
                    🏦 Pay by Bank Transfer
                  </div>
                  <div className="px-5 py-4 bg-white text-sm text-gray-500 space-y-1 border-t border-gray-100">
                    <p>Account details will be provided on the next page.</p>
                    <p>Order and payment confirmation sent via <strong>WhatsApp</strong>.</p>
                  </div>
                </div>
              </section>

              <Button type="submit" className="w-full bg-black text-white py-4 text-sm font-bold tracking-widest uppercase rounded-xl hover:bg-[#c9a96e] hover:text-black transition h-auto">
                Place Order
              </Button>
            </div>

            {/* ── RIGHT — Order Summary ─────────────────────────────────── */}
            <div className="lg:sticky lg:top-24 h-fit space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-base text-black">Order Summary</h2>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 bg-gray-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                          {item.qty}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                        {item.detail && <p className="text-xs text-gray-400">{item.detail}</p>}
                      </div>
                      <p className="text-sm font-semibold text-gray-800 flex-shrink-0">
                        £{(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100" />

                {/* Discount */}
                <div className="flex gap-2">
                  <Input placeholder="Discount code or gift card" value={discount}
                    onChange={(e) => setDiscount(e.target.value)} className="flex-1 text-sm" />
                  <Button type="button" variant="outline"
                    onClick={() => discount && setDiscountApplied(true)}
                    className="text-sm px-4 shrink-0">Apply</Button>
                </div>
                {discountApplied && <p className="text-xs text-green-600">Discount code applied!</p>}

                <div className="border-t border-gray-100" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Pickup in store</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                <div className="flex justify-between items-center">
                  <span className="font-bold text-base text-black">Total</span>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 mr-1">GBP</span>
                    <span className="font-bold text-lg text-black">£{subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}