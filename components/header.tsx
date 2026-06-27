'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/Container'
import NavBar from '@/components/header/NavBar'
import MobileMenu from '@/components/header/MobileMenu'
import CartSheet from '@/components/header/CartSheet'
import SearchOverlay from '@/components/header/SearchOverlay'
const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
const [searchOpen, setSearchOpen] = useState(false)
  return (
  <>
    <Container>
      <header
        className={`fixed top-0 left-0 right-0 z-50  transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-gray-200'
            : 'bg-transparent'
        }`}
      >
        <NavBar
          scrolled={scrolled}
          onCartOpen={() => setCartOpen(true)}
          onMenuOpen={() => setMobileMenuOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
        />
      </header>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onCartOpen={() => setCartOpen(true)}
      />
    </Container>

    {/* ✅ MOVE IT HERE */}
    <SearchOverlay
      open={searchOpen}
      onClose={() => setSearchOpen(false)}
    />

    <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
  </>
)
}

export default Header