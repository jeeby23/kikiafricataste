'use client'

import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
export default function FloatingWhatsApp() {
  const phone = '447123456789' 
  const message = encodeURIComponent(
    'Hello! I would like to enquire about your products.'
  )

  return (
    <Link
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110 hover:shadow-2xl"
    >
      <FaWhatsapp className="h-8 w-8" />
    </Link>
  )
}