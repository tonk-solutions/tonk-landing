import React from "react";
import { Linkedin, Instagram, MessageCircle, Mail } from "lucide-react";
import TonkLogo from "./TonkLogo";
import { CONTACT_EMAIL } from "../constants";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="bg-brand-navy text-white overflow-hidden"
    >
      <div className="container-content px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:items-start">
          {/* Brand */}
          <div className="max-w-sm">
            <TonkLogo size="md" theme="dark" />
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Consultora start up dedicada al desarrollo de software y soluciones
              digitales a medida, trabajando especialmente en integraciones y
              soluciones escalables. Experiencia en: Core Banking, SAP, ERP,
              Cloud-Native, Microservicios e Inteligencia Artificial.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            {/* Contact nav */}
            <nav aria-label="Links de contacto">
              <h3 className="mb-4 font-semibold text-white">Contacto</h3>
              <ul role="list" className="flex flex-col gap-3">
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                    aria-label={`Enviar email a Tonk Solutions: ${CONTACT_EMAIL}`}
                  >
                    <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/+5491123908349"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                    aria-label="Abrir chat de WhatsApp con Tonk Solutions"
                  >
                    <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />
                    WhatsApp
                  </a>
                </li>
              </ul>
            </nav>

            {/* Social nav */}
            <nav aria-label="Redes sociales">
              <h3 className="mb-4 font-semibold text-white">Seguinos</h3>
              <ul role="list" className="flex gap-4">
                <li>
                  <a
                    href="https://www.linkedin.com/company/tonk-solutions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                    aria-label="Tonk Solutions en LinkedIn"
                  >
                    <Linkedin size={20} strokeWidth={1.5} aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/tonk_solutions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                    aria-label="Tonk Solutions en Instagram"
                  >
                    <Instagram size={20} strokeWidth={1.5} aria-hidden="true" />
                    <span>Instagram</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            <small>
              © {currentYear} Tonk Solutions. Todos los derechos reservados.
            </small>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
