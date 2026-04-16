'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button.js';
import {
  Menu,
  X,
  Stethoscope,
  Building2,
  User,
} from 'lucide-react';

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#clinics', label: 'Our Clinics' },
  { href: '#about', label: 'About Us' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="text-foreground">MediCare</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="default"
              className="font-semibold"
              asChild
            >
              <Link href="/login/staff" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Staff
              </Link>
            </Button>
            <Button
              size="default"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
              asChild
            >
              <Link href="/patient-access" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Patients
              </Link>
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile CTA Buttons */}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full font-semibold"
                asChild
              >
                <Link href="/login/staff" className="flex items-center justify-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Staff
                </Link>
              </Button>
              <Button
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
                asChild
              >
                <Link href="/patient-access" className="flex items-center justify-center gap-2">
                  <User className="h-4 w-4" />
                  Patients
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
