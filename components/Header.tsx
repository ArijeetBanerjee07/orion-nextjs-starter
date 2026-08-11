'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Header() {
  const [active, setActive] = useState('Features');
  const navItems = ['Features', 'Testimonials', 'About Us'];

  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] w-full px-4 sm:px-8 py-4 sm:py-5 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative pointer-events-auto">
      {/* Left: Logo and Wordmark */}
      <Link href="/" className="flex items-center gap-3 cursor-target group">
        <svg 
          width="26" 
          height="26" 
          viewBox="0 0 256 256" 
          fill="#ffffff" 
          xmlns="http://www.w3.org/2000/svg"
          className="group-hover:scale-105 transition-transform"
        >
          <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
        </svg>
        <span className="text-white text-2xl font-playfair italic pr-2">Orion</span>
      </Link>

      {/* Center pill nav */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1 cursor-target">
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(' ', '')}`}
            onClick={() => setActive(item)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              active === item
                ? 'bg-white/20 text-white'
                : 'text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            {item}
          </a>
        ))}
      </div>

      {/* Right (desktop) */}
      <Link href={session ? "/dashboard" : "/login"} className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors cursor-target">
        {session ? "Dashboard" : "Get Started"}
      </Link>
      </div>
    </nav>
  );
}
