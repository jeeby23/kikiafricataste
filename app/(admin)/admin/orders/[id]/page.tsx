'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, MapPin } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useOrderById, useConfirmOrder, useCancelOrder } from '@/features/orders/orders.query'
import PageLoader from '@/components/shared/PageLoader'

const fmtPounds = (v: number) => `£${Number(v || 0).toFixed(2)}`
const fmtPence = (v: number) => `£${(Number(v || 0) / 100).toFixed(2)}`

const toPounds = (pence: number) => Number(pence || 0) / 100

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: order, isLoading } = useOrderById(id)
  const confirmOrder = useConfirmOrder()
  const cancelOrder = useCancelOrder()

  const [isConfirming, setIsConfirming] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const handleConfirm = () => {
    if (!order) return
    setIsConfirming(true)
    confirmOrder.mutate(order.id, {
      onSuccess: () => alert('Order confirmed successfully!'),
      onSettled: () => setIsConfirming(false),
    })
  }

  const handleCancel = () => {
    if (!order) return
    if (!confirm('Are you sure you want to cancel this order?')) return
    setIsCancelling(true)
    cancelOrder.mutate(order.id, {
      onSuccess: () => alert('Order cancelled successfully!'),
      onSettled: () => setIsCancelling(false),
    })
  }

  if (isLoading)
    return (
      <PageLoader title="Loading Order..." description="Please wait while we fetch the order." />
    )
  if (!order) return <div className="p-8 text-center text-red-500">Order not found</div>

  const isPending = order.status === 'PENDING_PAYMENT'
  const isConfirmed = order.status === 'CONFIRMED'
  const isCancelled = order.status === 'CANCELLED'

  // All monetary values from DB are in pence
  const subtotalPounds = toPounds(order.subtotal)
  const deliveryPounds = toPounds(order.deliveryFee)
  const trueTotal = subtotalPounds + deliveryPounds

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 space-y-6">
          {/* Back button */}
          <Link href="/admin/orders">
            <button className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition">
              <ArrowLeft size={20} />
              <span>Back to Orders</span>
            </button>
          </Link>

          {/* Order information */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Order #{order.orderNumber}</h1>

            <p className="text-sm text-gray-500">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Status */}
          <div>
            <Badge
              variant={isConfirmed ? 'default' : isCancelled ? 'destructive' : 'secondary'}
              className="px-4 py-1 text-sm w-fit"
            >
              {order.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Actions */}
          {isPending && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="bg-green-600 hover:bg-green-700 text-white sm:w-auto w-full"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isConfirming ? 'Confirming...' : 'Confirm Order'}
              </Button>

              <Button
                onClick={handleCancel}
                disabled={isCancelling}
                variant="destructive"
                className="sm:w-auto w-full"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left — items */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images?.[0]?.url || '/placeholder.png'}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.pricingType === 'PER_KG'
                          ? `${item.weightKg} kg × £${item.unitPrice}/kg`
                          : `${item.quantity} × £${item.unitPrice}`}
                      </p>
                    </div>
                    {/* item.subtotal is in pence → convert to pounds */}
                    <div className="text-right font-medium">
                      {fmtPounds(toPounds(item.subtotal))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span>{order.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">WhatsApp</span>
                  <a
                    href={`https://wa.me/${(order.customerWhatsapp ?? '').replace(/\D/g, '')}`}
                    className="text-blue-600 hover:underline"
                  >
                    {order.customerWhatsapp}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Delivery Details
              </h2>
              <div className="text-sm space-y-2">
                <p>{order.deliveryAddress}</p>
                <p>
                  {order.deliveryCity}, {order.deliveryState}
                </p>
                {order.notes && <p className="text-amber-600 italic mt-3">Note: {order.notes}</p>}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{fmtPounds(subtotalPounds)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span>{order.deliveryFee === 0 ? 'Free' : fmtPence(order.deliveryFee)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{fmtPounds(trueTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
