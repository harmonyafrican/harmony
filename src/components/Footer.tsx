// src/components/Footer.tsx
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Logo/Title */}
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="text-yellow-400 font-script">Harmony</span>{' '}
          <span className="text-white">Africa Foundation</span>
        </h2>

        {/* Mission Statement */}
        <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
          Empowering Africa's youth through education, technology, and innovation - one life at a time.
        </p>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-12">
          <a
            href="https://facebook.com/harmonyafrica"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Facebook"
          >
            <FaFacebookF size={24} />
          </a>
          <a
            href="https://twitter.com/harmonyafrica"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Twitter"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://instagram.com/harmonyafrica"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Instagram"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://linkedin.com/company/harmony-africa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={24} />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Harmony Africa Foundation. All rights reserved. | Registered in Rwanda under Certificate N° 96/RGB/FDN/LP/06/2025
        </p>
      </div>
    </footer>
  );
}