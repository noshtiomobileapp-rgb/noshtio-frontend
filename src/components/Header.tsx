'use client'
import Link from 'next/link'
export default function Header(){
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">Qrestro</Link>
        <nav className="flex items-center gap-4">
          <Link href="/customer" className="text-sm">Customer</Link>
          <Link href="/vendor" className="text-sm">Vendor</Link>
        </nav>
      </div>
    </header>
  )
}
