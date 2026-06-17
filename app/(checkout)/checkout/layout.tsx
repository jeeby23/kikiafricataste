import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/kikiafrica-logo.webp"
              alt="Kiki African Taste"
              width={48}
              height={48}
              className="object-contain"
            />
            <span className="font-bold text-2xl tracking-wider text-black hidden sm:block">
              KIKI AFRICAN TASTE
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-8">
            <Link href="/products" className="text-sm text-black hover:text-black transition">
              Shop
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="relative text-black hover:text-black transition">
              <ShoppingCart size={24} />
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-7">{children}</main>
    </div>
  );
}