'use client';

import {
  Building2,
  User,
  FileText,
  Heart,
  ClipboardList,
  Shield,
  Users,
  Calendar,
  Clock,
  Bell,
  Search,
} from 'lucide-react';

const clinicFeatures = [
  {
    icon: FileText,
    title: 'Digital Records',
    description: 'Paperless patient records and prescriptions',
  },
  {
    icon: Shield,
    title: 'Data Security',
    description: 'HIPAA compliant data protection',
  },
  {
    icon: Users,
    title: 'Patient Management',
    description: 'Complete patient database and profiles',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Automated appointment management',
  },
];

const patientFeatures = [
  {
    icon: Heart,
    title: 'Health History',
    description: 'Access your complete medical records',
  },
  {
    icon: ClipboardList,
    title: 'Prescriptions',
    description: 'View and manage your prescriptions online',
  },
  {
    icon: Calendar,
    title: 'Easy Booking',
    description: 'Schedule appointments in just a few clicks',
  },
  {
    icon: Bell,
    title: 'Reminders',
    description: 'Never miss an appointment or medication',
  },
  {
    icon: Search,
    title: 'Find Doctors',
    description: 'Search and book appointments with specialists',
  },
];

export function Services() {
  return (
    <section id="services" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 text-balance">
              Solutions for Clinics & Patients
            </h2>
          </div>

          {/* Two column layout */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Clinic Management */}
            <div className="bg-background border border-border rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Clinic Management
                </h3>
              </div>

              <p className="text-muted-foreground mb-6">
                Comprehensive tools designed specifically for healthcare providers to streamline operations and improve patient care.
              </p>

              <div className="space-y-4">
                {clinicFeatures.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Portal */}
            <div className="bg-background border border-border rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Patient Portal
                </h3>
              </div>

              <p className="text-muted-foreground mb-6">
                Empower patients with convenient access to their health information and appointment management.
              </p>

              <div className="space-y-4">
                {patientFeatures.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <feature.icon className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
