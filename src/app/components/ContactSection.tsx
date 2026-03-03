"use client";

import React from "react";
import { Mail, MapPin, MessageCircle, Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import {
  contactSchema,
  type ContactFormData,
  type ContactContent,
  type ContactItemData,
} from "@/types/content";
import { CONTACT_EMAIL, WHATSAPP_URL } from "../constants";

const iconMap: Record<string, React.ElementType> = {
  Mail,
  Phone: MessageCircle,
  MapPin,
  MessageCircle,
};

const DEFAULT_CONTACT_ITEMS: ContactItemData[] = [
  {
    icon: "Mail",
    label: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: "Phone",
    label: "WhatsApp",
    value: "Escribinos por WhatsApp",
    href: WHATSAPP_URL,
  },
  {
    icon: "MapPin",
    label: "Ubicación",
    value: "Buenos Aires, Argentina",
  },
];

interface ContactItemProps {
  item: ContactItemData;
}

const ContactItem: React.FC<ContactItemProps> = ({ item }) => {
  const Icon = iconMap[item.icon] || Mail;
  return (
    <li className="flex items-start gap-4">
      <div
        className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10"
        aria-hidden="true"
      >
        <Icon
          className="text-brand-blue"
          size={20}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{item.label}</p>
        {item.href ? (
          <a
            href={item.href}
            className="text-sm text-muted-foreground transition-colors hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {item.value}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">{item.value}</p>
        )}
      </div>
    </li>
  );
};

interface ContactSectionProps {
  content: ContactContent;
}

const ContactSection: React.FC<ContactSectionProps> = ({ content }) => {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ContactFormData) => {
    try {
      // Replace FORMSPREE_ID with your actual Formspree form ID
      const FORMSPREE_ENDPOINT = "https://formspree.io/f/FORMSPREE_ID";
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Error al enviar");

      toast({
        title: "¡Mensaje enviado!",
        description:
          "Gracias por contactarnos. Te responderemos a la brevedad.",
      });
      form.reset();
    } catch {
      toast({
        variant: "destructive",
        title: "Error al enviar",
        description:
          "No pudimos enviar tu mensaje. Por favor intenta por WhatsApp o email directamente.",
      });
    }
  };

  const contactItems =
    content?.contactItems?.length > 0
      ? content.contactItems
      : DEFAULT_CONTACT_ITEMS;

  return (
    <section
      id="contacto"
      aria-labelledby="contact-heading"
      className="section-padding relative overflow-hidden bg-white scroll-mt-20"
    >
      {/* Decorative blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-brand-blue opacity-5 blur-[100px]"
      />

      <div className="container-content relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-[var(--space-xl)] text-center">
          {content?.label && (
            <Badge variant="accent" className="mb-4">
              {content.label}
            </Badge>
          )}
          <h2
            id="contact-heading"
            className="font-bold text-foreground"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            {content?.title ?? "¿Hablamos?"}
          </h2>
          {content?.description && (
            <p
              className="mx-auto mt-4 max-w-xl text-muted-foreground"
              style={{ fontSize: "var(--text-lg)" }}
            >
              {content.description}
            </p>
          )}
        </header>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-[var(--space-xl)] lg:grid-cols-2">
          {/* Contact info */}
          <div className="flex flex-col gap-6">
            <h3
              className="font-semibold text-foreground"
              style={{ fontSize: "var(--text-xl)" }}
            >
              Información de contacto
            </h3>
            <ul
              role="list"
              aria-label="Formas de contacto directo"
              className="flex flex-col gap-5"
            >
              {contactItems.map((item) => (
                <ContactItem key={item.label} item={item} />
              ))}
            </ul>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="mt-2 self-start"
            >
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir chat de WhatsApp con Tonk Solutions"
              >
                <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
                Escribir por WhatsApp
              </a>
            </Button>
          </div>

          {/* Contact form */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:p-8">
            <h3
              className="mb-6 font-semibold text-foreground"
              style={{ fontSize: "var(--text-xl)" }}
            >
              Envianos un mensaje
            </h3>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                aria-label="Formulario de contacto"
                noValidate
                className="flex flex-col gap-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tu nombre completo"
                          autoComplete="name"
                          aria-required="true"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          autoComplete="email"
                          aria-required="true"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tu empresa"
                          autoComplete="organization"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensaje *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Contanos sobre tu proyecto o consulta..."
                          rows={4}
                          className="resize-none"
                          aria-required="true"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  disabled={isSubmitting}
                  className="mt-2 w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={18} strokeWidth={1.5} aria-hidden="true" />
                      Enviar mensaje
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
