"use client";

import {
  Building2,
  User,
  FileText,
  BarChart3,
  Heart,
  ClipboardList,
} from "lucide-react";

const clinicFeatures = [
  {
    icon: FileText,
    title: "Digital Records",
    description: "Paperless patient records and prescriptions",
  },
];

const patientFeatures = [
  {
    icon: Heart,
    title: "Health History",
    description: "Access your complete medical records",
  },
  {
    icon: ClipboardList,
    title: "Prescriptions",
    description: "View and manage your prescriptions online",
  },
];

export function Services() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Whether you are a healthcare provider or a patient, we have the tools
            to streamline your healthcare experience.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Clinic Management Card */}
          <div
            id="for-clinics"
            className="bg-card rounded-2xl border border-border p-8 lg:p-10 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  Clinic Management
                </h3>
                <p className="text-muted-foreground">For Healthcare Providers</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              A complete suite of tools designed to streamline your clinic
              operations. Manage appointments, patient records, staff schedules,
              and billing all in one place.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
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

          {/* Patient Portal Card */}
          <div
            id="patient-portal"
            className="bg-card rounded-2xl border border-border p-8 lg:p-10 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                <User className="h-7 w-7 text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  Patient Portal
                </h3>
                <p className="text-muted-foreground">For Patients</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Take control of your healthcare journey. Book appointments, access
              your medical records, manage prescriptions, and connect with your
              healthcare providers easily.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
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
    </section>
  );
}
