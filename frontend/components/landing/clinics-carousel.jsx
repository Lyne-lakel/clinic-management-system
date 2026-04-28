"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Clock } from "lucide-react";
import { clinics } from "../../lib/clinics-data.js";

export { clinics };

export function ClinicsCarousel() {
  const firstClinic = clinics[0];

  return (
    <section id="clinics" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Our Network
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4 text-balance">
            Our Healthcare Partners
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We are expanding our network of partner clinics. Currently partnering with leading healthcare facilities.
          </p>
        </div>
      </div>

      {/* Clinics grid - 1 active + 2 coming soon */}
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* Active clinic - clickable */}
          <Link
            href={`/clinics/${firstClinic.slug}`}
            className="group"
          >
            <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border hover:shadow-2xl hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
              <div className="relative h-64 overflow-hidden bg-muted">
                <Image
                  src={firstClinic.image}
                  alt={firstClinic.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-card/95 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-foreground">
                    {firstClinic.rating}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-primary/20 transition-all duration-300" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {firstClinic.name}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span className="text-sm">{firstClinic.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Clock className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span className="text-sm">{firstClinic.hours}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {firstClinic.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-4 border-t border-border">
                  <div className="text-sm text-primary font-semibold group-hover:translate-x-1 transition-transform">
                    View Details →
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Coming soon card 1 */}
          <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-dashed border-muted-foreground/30 p-6 flex flex-col items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-secondary">+</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Coming Soon
              </h3>
              <p className="text-muted-foreground text-sm">
                New healthcare partner clinic joining our network
              </p>
            </div>
          </div>

          {/* Coming soon card 2 */}
          <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-dashed border-muted-foreground/30 p-6 flex flex-col items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-secondary">+</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Coming Soon
              </h3>
              <p className="text-muted-foreground text-sm">
                Expanding our partnership network across Algeria
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
