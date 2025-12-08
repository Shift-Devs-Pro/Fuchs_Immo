'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-fuchs-white border-b border-fuchs-cream sticky top-0 z-50">
      <nav className="container-custom">
        <div className="flex h-20 justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="font-display text-2xl font-bold text-fuchs-black">
              <span className="text-fuchs-gold">Fuchs</span> Immobilier
            </Link>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className="text-fuchs-black font-medium hover:text-fuchs-gold transition-colors duration-300"
            >
              Accueil
            </Link>
            <Link
              href="/proprietes"
              className="text-fuchs-black font-medium hover:text-fuchs-gold transition-colors duration-300"
            >
              Nos Biens
            </Link>
            <Link
              href="/about"
              className="text-fuchs-black font-medium hover:text-fuchs-gold transition-colors duration-300"
            >
              À propos
            </Link>
            <Link
              href="/contact"
              className="text-fuchs-black font-medium hover:text-fuchs-gold transition-colors duration-300"
            >
              Contact
            </Link>
            <Link
              href="/backoffice"
              className="text-sm text-fuchs-gold/70 hover:text-fuchs-gold transition-colors duration-300 border border-fuchs-gold/30 hover:border-fuchs-gold px-3 py-1.5 rounded"
            >
              Backoffice
            </Link>
            <Link href="/estimation" className="btn-primary">
              Estimation Gratuite
            </Link>
          </div>

          {/* Burger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-fuchs-black hover:text-fuchs-gold transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-20 bg-fuchs-white transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col space-y-6 p-8">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="text-fuchs-black text-lg font-medium hover:text-fuchs-gold transition-colors duration-300"
          >
            Accueil
          </Link>
          <Link
            href="/proprietes"
            onClick={closeMobileMenu}
            className="text-fuchs-black text-lg font-medium hover:text-fuchs-gold transition-colors duration-300"
          >
            Nos Biens
          </Link>
          <Link
            href="/about"
            onClick={closeMobileMenu}
            className="text-fuchs-black text-lg font-medium hover:text-fuchs-gold transition-colors duration-300"
          >
            À propos
          </Link>
          <Link
            href="/contact"
            onClick={closeMobileMenu}
            className="text-fuchs-black text-lg font-medium hover:text-fuchs-gold transition-colors duration-300"
          >
            Contact
          </Link>
          <Link
            href="/backoffice"
            onClick={closeMobileMenu}
            className="text-fuchs-gold text-sm hover:text-fuchs-gold/80 transition-colors duration-300 border border-fuchs-gold/30 hover:border-fuchs-gold px-4 py-2 rounded text-center"
          >
            Backoffice
          </Link>
          <Link
            href="/estimation"
            onClick={closeMobileMenu}
            className="btn-primary inline-block text-center"
          >
            Estimation Gratuite
          </Link>
        </nav>
      </div>

      {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
      {mobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="md:hidden fixed inset-0 top-20 bg-fuchs-black/50 -z-10"
        />
      )}
    </header>
  )
}
