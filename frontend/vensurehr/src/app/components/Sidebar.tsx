'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Talent Pool' },
    { href: '/jobs', label: 'Jobs' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-slate-900 text-white flex flex-col z-10">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Talent Intelligence
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const isActive =
            link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom branding */}
      <div className="px-6 py-4 border-t border-slate-700">
        <span className="text-xs text-slate-400">VensureHR</span>
      </div>
    </aside>
  )
}
