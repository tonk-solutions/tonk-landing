import { getTranslations } from "next-intl/server";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";
import { SectionHeader } from "../layout/SectionHeader";
import { ServicesAccordion } from "./ServicesAccordion";

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

export async function ServicesSection() {
  const t = await getTranslations("services");
  const craft = t.raw("craft") as ServiceGroup;
  const talent = t.raw("talent") as ServiceGroup;

  return (
    <Section id="s03" titleId="t03">
      <Container>
        <SectionHeader
          number={t("number")}
          label={t("label")}
          meta={t("meta")}
          title={t("title")}
          titleId="t03"
          intro={t("intro")}
        />
        <ServicesAccordion
          craft={craft}
          talent={talent}
          cta={t("cta")}
        />
      </Container>
    </Section>
  );
}
