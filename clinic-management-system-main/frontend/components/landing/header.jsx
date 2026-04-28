"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button.tsx";
import Image from "next/image";
import {
  Menu,
  X,
  Building2,
  User,
} from "lucide-react";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#clinics", label: "Our Clinics" },
  { href: "#about", label: "About Us" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/medflow-logo.png"
              alt="MedFlow Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-foreground">
              MedFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              size="default"
              className="font-semibold text-white"
              style={{ backgroundColor: 'rgb(189, 67, 185)' }}
              asChild
            >
              <Link href="/login/staff" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Staff
              </Link>
            </Button>
            <Button
              size="default"
              className="font-semibold text-white"
              style={{ backgroundColor: 'rgb(189, 67, 185)' }}
              asChild
            >
              <Link href="/login/patients" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Patients
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
              <Button
                className="w-full font-semibold text-white"
                style={{ backgroundColor: 'rgb(189, 67, 185)' }}
                asChild
              >
                <Link href="/login/staff" className="flex items-center justify-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Staff
                </Link>
              </Button>
              <Button
                className="w-full font-semibold text-white"
                style={{ backgroundColor: 'rgb(189, 67, 185)' }}
                asChild
              >
                <Link href="/login/patients" className="flex items-center justify-center gap-2">
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
