// src/components/Navbar.tsx
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Harmony Africa
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
          <li><Link to="/about" className="hover:text-blue-600">About</Link></li>
          <li><Link to="/programs" className="hover:text-blue-600">Programs</Link></li>
          <li><Link to="/impact" className="hover:text-blue-600">Impact</Link></li>
          <li><Link to="/donate" className="hover:text-blue-600">Donate</Link></li>
          <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-6 pb-6 space-y-4">
          <Link to="/" className="block text-gray-700 font-medium hover:text-blue-600">Home</Link>
          <Link to="/about" className="block text-gray-700 font-medium hover:text-blue-600">About</Link>
          <Link to="/programs" className="block text-gray-700 font-medium hover:text-blue-600">Programs</Link>
          <Link to="/impact" className="block text-gray-700 font-medium hover:text-blue-600">Impact</Link>
          <Link to="/donate" className="block text-gray-700 font-medium hover:text-blue-600">Donate</Link>
          <Link to="/contact" className="block text-gray-700 font-medium hover:text-blue-600">Contact</Link>
        </div>
      )}
    </nav>
  )
}
