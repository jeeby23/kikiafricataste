'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, CheckCircle, Truck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const PICKUP_LOCATION = {
  name: 'Kiki African Taste — UK Store',
  address: '14 Brixton Market Row, Brixton, London SW9 8PR, United Kingdom',
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.5!2d-0.112!3d51.463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b8c5b5c5b5%3A0x8c5b5c5b5c5b5c5b!2sBrixton+Market!5e0!3m2!1sen!2suk!4v1234567890', 
}

export default function OrderConfirmation() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const penceToPounds = (pence: number) => (pence || 0) / 100
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedOrder = localStorage.getItem(`order_${orderId}`)

    if (storedOrder) {
      setOrder(JSON.parse(storedOrder))
    } else {
      router.push('/checkout')
    }
    setLoading(false)
  }, [orderId, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading order...</div>
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-black">
        <p>Order not found</p>
        <Link href="/products" className="text-[#c9a96e] underline">
          Go to Shop
        </Link>
      </div>
    )
  }

  // 1. Detect delivery method
  const isPickup = order.deliveryPostCode === 'PICKUP' || order.deliveryAddress === 'Store Pickup'

  // 2. Base math subtotal calculation
  const subtotal = order.items.reduce((sum: number, item: any) => sum + item.price * item.qty, 0)
  
  // 3. FORCE delivery fee to 0 if it's a pickup order
  const rawFee = order.deliveryFee || 0
  const deliveryFeePounds = isPickup ? 0 : (rawFee > 100 ? penceToPounds(rawFee) : rawFee)
  
  // 4. Strict total resolution
  const displayTotal = isPickup ? subtotal : subtotal + deliveryFeePounds

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-black pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
                <div>
                  <p className="text-green-600 font-medium">Confirmation #{orderId}</p>
                  <h1 className="text-4xl font-bold text-black">
                    Thank you, {order.customerName}!
                  </h1>
                </div>
              </div>
              <p className="text-lg text-gray-600">
                {isPickup ? 'Your order is confirmed for pickup.' : 'Your order is confirmed for shipping.'}
              </p>
            </div>

            {/* Map/Pickup Visuals */}
            {isPickup && (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                <iframe
                  src={PICKUP_LOCATION.mapEmbed}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-white rounded-2xl shadow-lg p-5 max-w-xs">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Pickup Location</p>
                      <p className="text-sm text-gray-600 mt-1 leading-tight">
                        {PICKUP_LOCATION.address}
                      </p>
                      <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
                        <Clock size={14} /> Usually ready within 2–4 hours
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-8 space-y-6">
              <h3 className="font-semibold text-lg">Your order is confirmed</h3>
              <p className="text-gray-600">
                {isPickup
                  ? 'You’ll receive a confirmation text and WhatsApp message when your order is ready for pickup.'
                  : 'You’ll receive a tracking update and WhatsApp message as soon as your package has been dispatched.'}
              </p>

              <div className="pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-3">Bank Transfer Details</h4>
                  <div className="space-y-1.5 text-sm">
                    <p>
                      <strong>Bank:</strong> Monzo Bank
                    </p>
                    <p>
                      <strong>Account Number:</strong> 16084551
                    </p>
                    <p>
                      <strong>Sort Code:</strong> 04-00-03
                    </p>
                    <p>
                      <strong>Account Name:</strong> KIKI AFRICAN TASTE LTD
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Kindly make payment within <strong>30 minutes</strong>.<br />
                  Payment confirmation will be sent to your email.
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <h3 className="font-semibold text-lg mb-6">Order Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 text-sm">
                <div>
                  <p className="font-medium mb-1">Contact</p>
                  <p>{order.customerWhatsapp || order.phone}</p>
                  <p className="text-gray-500">{order.customerEmail || order.email}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{isPickup ? 'Pickup Location' : 'Delivery Method'}</p>
                  <p className="text-gray-600 flex items-center gap-1.5">
                    {isPickup ? (
                      PICKUP_LOCATION.address
                    ) : (
                      <>
                        <Truck size={16} className="text-gray-500" /> Standard Courier Delivery
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Payment Method</p>
                  <p>Bank Transfer • £{displayTotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{isPickup ? 'Billing Address' : 'Shipping Address'}</p>
                  <p className="text-gray-600">
                    {isPickup ? (
                      order.address || 'Store Pickup'
                    ) : (
                      <>
                        {order.deliveryAddress}<br />
                        {order.deliveryCity}, {order.deliveryPostCode}<br />
                        {order.deliveryState}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 sticky top-6">
              <h3 className="font-semibold text-lg mb-6">Your Order</h3>

              <div className="space-y-6">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium leading-tight">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <p className="font-medium whitespace-nowrap">
                      £{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t my-8" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping / Fulfillment</span>
                  <span className={isPickup ? 'text-green-600 font-semibold' : ''}>
                    {isPickup ? 'FREE' : `£${deliveryFeePounds.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t my-6" />

              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold">£{displayTotal.toFixed(2)}</span>
              </div>

              <Link
                href="/products"
                className="mt-10 block w-full bg-black hover:bg-[#c9a96e] hover:text-black transition text-white text-center py-4 rounded-2xl font-bold tracking-widest uppercase text-xs"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}