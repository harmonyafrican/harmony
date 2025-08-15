// src/app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6 text-center">
      <p className="mb-2">&copy; {new Date().getFullYear()} Harmony Africa Foundation</p>
      <p className="text-sm">
        <a href="mailto:info@harmonyafrica.org" className="underline hover:text-yellow-400">
          info@harmonyafrica.org
        </a>{' '}
        | +250 785 300 820
      </p>
    </footer>
  )
}
