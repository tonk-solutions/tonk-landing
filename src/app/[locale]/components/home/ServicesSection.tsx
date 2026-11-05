import { getLocale, getTranslations } from "next-intl/server";
import { withServiceHrefs, type ServiceGroupContent } from "@/app/services/catalog";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";
import { SectionHeader } from "../layout/SectionHeader";
import { ServicesAccordion } from "./ServicesAccordion";

export async function ServicesSection() {
  const t = await getTranslations("services");
  const locale = await getLocale();
  const { craft, talent } = withServiceHrefs(
    locale,
    t.raw("craft") as ServiceGroupContent,
    t.raw("talent") as ServiceGroupContent
  );

  return (
    <Section id="s03" titleId="t03">
      <Container>
        <SectionHeader
          number={t("number")}
          label={t("label")}
          meta={t("meta")}
          title={t("title")}
          titleId="t03"
        />
        <ServicesAccordion
          craft={craft}
          talent={talent}
          cta={t("cta")}
          viewDetails={t("viewDetails")}
        />
      </Container>
    </Section>
  );
}
