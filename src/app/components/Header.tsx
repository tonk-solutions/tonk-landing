"use client";

import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import TonkLogo from "./TonkLogo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types/content";

interface HeaderProps {
  navLinks: NavLink[];
  ctaLabel: string;
  ctaHref: string;
}

const Header: React.FC<HeaderProps> = ({ navLinks, ctaLabel, ctaHref }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      role="banner"
      className={cn(
        "fixed top-0 z-50 w-full max-w-[100vw] transition-all duration-300",
        scrolled
          ? "bg-background/95 shadow-sm backdrop-blur-sm"
          : "bg-transparent",
      )}
    >
      <div className="container-content px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Navegación principal"
          className="flex items-center justify-between py-4"
        >
          {/* Logo */}
          <a
            href="#inicio"
            aria-label="Tonk Solutions — Ir al inicio"
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <TonkLogo theme={scrolled ? "light" : "dark"} size="sm" />
          </a>

          {/* Desktop nav links */}
          {navLinks.length > 0 && (
            <ul
              role="list"
              className="hidden items-center gap-8 lg:flex"
              aria-label="Secciones"
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
                      scrolled ? "text-foreground" : "text-white",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* Desktop CTA */}
          <Button
            variant="accent"
            size="sm"
            asChild
            className="hidden lg:inline-flex"
          >
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>

          {/* Mobile hamburger — Sheet */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir menú de navegación"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                className={cn(
                  "lg:hidden",
                  scrolled
                    ? "text-foreground hover:bg-muted"
                    : "text-white hover:bg-white/10",
                )}
              >
                <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              id="mobile-nav"
              aria-label="Menú de navegación móvil"
              className="flex flex-col pt-12"
            >
              <SheetHeader className="text-left">
                <SheetTitle className="sr-only">Navegación</SheetTitle>
                <TonkLogo theme="light" size="sm" />
              </SheetHeader>

              {/* Mobile nav links */}
              <nav
                aria-label="Navegación móvil"
                className="mt-8 flex flex-col gap-1"
              >
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="block rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>

              {/* Mobile CTA */}
              <div className="mt-auto pb-6 pt-8">
                <SheetClose asChild>
                  <Button variant="accent" size="lg" className="w-full" asChild>
                    <a href={ctaHref}>{ctaLabel}</a>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};

export default Header;
