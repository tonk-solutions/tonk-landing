"use client";

import { useState } from "react";
import { WHATSAPP_URL } from "@/app/constants";
import styles from "./ServicesAccordion.module.css";

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

interface ServiceGroup {
  label: string;
  subtitle: string;
  services: ServiceItem[];
}

interface ServicesAccordionProps {
  craft: ServiceGroup;
  talent: ServiceGroup;
  cta: string;
  openLabel: string;
  closeLabel: string;
}

const ICONS: Record<string, React.ReactNode> = {
  FileText: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  ),
  Code: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </svg>
  ),
  Cloud: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  ),
  BrainCircuit: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M9 13h6" />
      <path d="M9 17h3" />
      <path d="M12 13V9" />
    </svg>
  ),
  Users: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Sparkles: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  ),
  UserCheck: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M16 11 18 13 22 9" />
    </svg>
  ),
};

function ServiceIcon({ name }: { name: string }) {
  return <span className={styles.icon}>{ICONS[name] ?? null}</span>;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span className={styles.chevron} data-open={open} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}

function ServiceGroupAccordion({
  group,
  baseIndex,
  openIndex,
  setOpenIndex,
  cta,
  openLabel,
  closeLabel,
}: {
  group: ServiceGroup;
  baseIndex: number;
  openIndex: number;
  setOpenIndex: (index: number) => void;
  cta: string;
  openLabel: string;
  closeLabel: string;
}) {
  return (
    <div className={styles.group}>
      <div className={styles.groupHead}>
        <span className={styles.groupLabel}>{group.label}</span>
        <p className={styles.groupSubtitle}>{group.subtitle}</p>
      </div>
      <ul className={styles.list}>
        {group.services.map((service, localIndex) => {
          const globalIndex = baseIndex + localIndex;
          const isOpen = openIndex === globalIndex;
          const headingId = `service-heading-${globalIndex}`;
          const panelId = `service-panel-${globalIndex}`;

          return (
            <li key={service.title} className={styles.item}>
              <h3 className={styles.heading} id={headingId}>
                <button
                  type="button"
                  className={styles.button}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={isOpen ? closeLabel : openLabel}
                  onClick={() => setOpenIndex(isOpen ? -1 : globalIndex)}
                >
                  <span className={styles.number}>
                    {String(globalIndex + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.title}>{service.title}</span>
                  <span className={styles.icons} aria-hidden="true">
                    <ServiceIcon name={service.icon} />
                    <Chevron open={isOpen} />
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={headingId}
                hidden={!isOpen}
                className={styles.panel}
              >
                <div className={styles.panelInner}>
                  <p className={styles.description}>{service.description}</p>
                  <a
                    className={styles.link}
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{cta} →</span>
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ServicesAccordion({
  craft,
  talent,
  cta,
  openLabel,
  closeLabel,
}: ServicesAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={styles.accordion}>
      <ServiceGroupAccordion
        group={craft}
        baseIndex={0}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        cta={cta}
        openLabel={openLabel}
        closeLabel={closeLabel}
      />
      <ServiceGroupAccordion
        group={talent}
        baseIndex={craft.services.length}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        cta={cta}
        openLabel={openLabel}
        closeLabel={closeLabel}
      />
    </div>
  );
}
