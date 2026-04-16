"use client";

import Link from "next/link";
import { Building2, User, ArrowRight } from "lucide-react";
import { Button } from "../ui/button.tsx";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background min-h-screen flex items-center">
      {/* Background decorative elements with animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/5 blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-primary/3 blur-3xl animate-bounce" />
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Main heading with animation */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 text-balance">
              Modern Healthcare
              <span className="text-primary block mt-2 animate-pulse"> Management</span> 
              <span className="text-foreground">Made Simple</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in animation-delay-300">
            Streamline your clinic operations with our comprehensive management system. 
            From appointment scheduling to patient records, we have everything you need 
            to deliver exceptional care.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12 animate-fade-in animation-delay-900">
            <Button
              size="lg"
              className="bg-foreground hover:bg-foreground/90 text-background font-semibold"
              asChild
            >
              <Link href="/login/staff" className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Staff Login
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-foreground hover:bg-foreground/90 text-background font-semibold"
              asChild
            >
              <Link href="/login/patients" className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Login
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
