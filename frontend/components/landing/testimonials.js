'use client';

import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Sarah Mitchell',
    role: 'Chief Medical Officer',
    clinic: 'Central Medical Center',
    avatar: '/images/avatar-1.jpg',
    content:
      'MediCare Pro has revolutionized how we manage our clinic. The scheduling system alone has reduced no-shows by 40%.',
    rating: 5,
  },
  {
    name: 'James Rodriguez',
    role: 'Practice Manager',
    clinic: 'Family Health Partners',
    avatar: '/images/avatar-2.jpg',
    content:
      'The analytics dashboard provides invaluable insights. We have been able to optimize our operations and improve patient satisfaction significantly.',
    rating: 5,
  },
  {
    name: 'Dr. Emily Chen',
    role: 'Pediatrician',
    clinic: 'Kids First Clinic',
    avatar: '/images/avatar-3.jpg',
    content:
      'The patient portal makes communication with families so much easier. Parents love being able to access records and schedule appointments online.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4 text-balance">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            See what medical professionals are saying about their experience
            with MediCare Pro.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-xl p-6 shadow-lg border border-border relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.clinic}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
