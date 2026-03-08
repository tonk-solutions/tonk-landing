"use client";

import React, { useState, useCallback } from "react";
import {
  Code,
  Cloud,
  FileText,
  BrainCircuit,
  Users,
  CheckCircle2,
  Sparkles,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ServicesContent, Branch, Service } from "@/types/content";

const iconMap: Record<string, LucideIcon> = {
  Code,
  Cloud,
  FileText,
  BrainCircuit,
  Users,
  CheckCircle: CheckCircle2,
  CheckCircle2,
  Sparkles,
  UserCheck,
};

interface ServiceDetailProps {
  service: Service;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service }) => {
  const Icon = iconMap[service.icon] || Code;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10">
          <Icon
            className="text-brand-blue"
            size={32}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
        <h3
          className="font-semibold text-foreground"
          style={{ fontSize: "var(--text-xl)" }}
        >
          {service.title}
        </h3>
      </div>

      <div className="h-px w-16 bg-brand-cyan" aria-hidden="true" />

      <p
        className="leading-relaxed text-muted-foreground"
        style={{ fontSize: "var(--text-base)" }}
      >
        {service.description}
      </p>
    </div>
  );
};

interface BranchPanelProps {
  branch: Branch;
  panelId: string;
  tabId: string;
}

const BranchPanel: React.FC<BranchPanelProps> = ({ branch, panelId, tabId }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedService = branch.services[selectedIndex];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % branch.services.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? branch.services.length - 1 : prev - 1,
      );
    }
  };

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      className="@container rounded-xl border border-border bg-card p-6 shadow-sm lg:p-8"
    >
      <p className="mb-6 text-sm text-muted-foreground">{branch.subtitle}</p>

      <div className="grid grid-cols-1 gap-6 @lg:grid-cols-[280px_1fr]">
        {/* Service list */}
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {branch.name === "Producto"
              ? "Nuestras Especialidades"
              : "Nuestros Servicios"}
          </p>
          <ul role="list" className="flex flex-col gap-2" onKeyDown={handleKeyDown}>
            {branch.services.map((service, index) => {
              const Icon = iconMap[service.icon] || Code;
              const isSelected = selectedIndex === index;
              return (
                <li key={service.title}>
                  <button
                    onClick={() => setSelectedIndex(index)}
                    aria-pressed={isSelected}
                    className={cn(
                      "w-full rounded-lg border-2 p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isSelected
                        ? "border-brand-blue bg-brand-blue/5"
                        : "border-border bg-transparent hover:border-brand-blue/30 hover:bg-brand-blue/5",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className={cn(
                          "shrink-0 transition-colors",
                          isSelected ? "text-brand-blue" : "text-muted-foreground",
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-semibold transition-colors",
                          isSelected ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {service.title}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Detail — desktop only via @container */}
        <div className="hidden @lg:block">
          {selectedService && <ServiceDetail service={selectedService} />}
        </div>
      </div>

      {/* Detail — mobile fallback */}
      <div className="mt-6 @lg:hidden">
        {selectedService && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <ServiceDetail service={selectedService} />
          </div>
        )}
      </div>
    </div>
  );
};

interface ServicesSectionProps {
  content: ServicesContent;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ content }) => {
  const [selectedBranch, setSelectedBranch] = useState(0);
  const branches = content?.branches ?? [];

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedBranch((prev) => (prev + 1) % branches.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedBranch((prev) =>
          prev === 0 ? branches.length - 1 : prev - 1,
        );
      }
    },
    [branches.length],
  );

  return (
    <section
      id="servicios"
      aria-labelledby="services-heading"
      className="section-padding bg-muted/30 overflow-hidden scroll-mt-20"
    >
      <div className="container-content px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <header className="mb-[var(--space-xl)] text-center">
          {content?.label && (
            <Badge variant="accent" className="mb-4">
              {content.label}
            </Badge>
          )}
          <h2
            id="services-heading"
            className="font-bold text-foreground"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            {content?.title}
          </h2>
          {content?.description && (
            <p
              className="mx-auto mt-4 max-w-2xl text-muted-foreground"
              style={{ fontSize: "var(--text-lg)" }}
            >
              {content.description}
            </p>
          )}
        </header>

        {/* Branch tabs */}
        {branches.length > 1 && (
          <div
            role="tablist"
            aria-label="Tipo de servicio"
            className="mb-8 flex justify-center"
            onKeyDown={handleTabKeyDown}
          >
            <div className="flex rounded-full border-2 border-border bg-card p-1">
              {branches.map((branch, index) => {
                const isSelected = selectedBranch === index;
                const tabId = `tab-${branch.name.toLowerCase()}`;
                const panelId = `panel-${branch.name.toLowerCase()}`;
                return (
                  <button
                    key={branch.name}
                    id={tabId}
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls={panelId}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setSelectedBranch(index)}
                    className={cn(
                      "rounded-full px-8 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isSelected
                        ? "bg-brand-blue text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {branch.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Branch panels */}
        {branches.map((branch, index) => {
          const tabId = `tab-${branch.name.toLowerCase()}`;
          const panelId = `panel-${branch.name.toLowerCase()}`;
          return (
            <div
              key={branch.name}
              className={cn(selectedBranch === index ? "block" : "hidden")}
            >
              <BranchPanel branch={branch} panelId={panelId} tabId={tabId} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesSection;
