"use client";

export function About() {
  return (
    <section id="about" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Section header */}
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-8 text-balance">
            Transforming Healthcare Management
          </h2>

          {/* Story content */}
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              MediCare Pro was founded with a simple yet powerful mission: to make healthcare
              administration effortless so providers can focus on what matters most - patient care.
              Our journey began when a group of healthcare professionals and technology experts
              came together, united by a shared frustration with outdated clinic management systems.
            </p>
            <p>
              We understood that healthcare providers spend countless hours on paperwork,
              appointment scheduling, and administrative tasks - time that could be better
              spent caring for patients. This insight drove us to create a platform that
              combines cutting-edge technology with intuitive design, delivering a solution
              that works seamlessly for clinics of all sizes.
            </p>
            <p>
              Today, MediCare Pro continues to evolve and improve our platform, always keeping our users and their
              patients at the heart of everything we do. We remain committed to innovation, security, and user experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
