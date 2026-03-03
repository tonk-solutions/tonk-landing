import React from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import { getFrontmatterOnly } from "@/lib/mdx-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { TeamContent, TeamMember } from "@/types/content";

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, index }) => {
  const memberId = `member-${index}-name`;

  return (
    <li>
      <Card
        variant="elevated"
        className="h-full overflow-hidden"
        aria-labelledby={memberId}
        role="article"
      >
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center h-full">
          {/* Avatar */}
          <div className="relative size-20 shrink-0">
            {member.avatarUrl ? (
              <div className="size-20 overflow-hidden rounded-full border-4 border-border shadow-sm">
                <Image
                  src={member.avatarUrl}
                  alt={`${member.name}, ${member.role} en Tonk Solutions`}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  sizes="80px"
                />
              </div>
            ) : (
              <div
                className="flex size-20 items-center justify-center rounded-full border-4 border-border bg-brand-blue text-2xl font-bold text-white"
                aria-hidden="true"
              >
                {member.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col gap-2">
            <h3
              id={memberId}
              className="font-semibold text-foreground"
              style={{ fontSize: "var(--text-lg)" }}
            >
              {member.name}
            </h3>
            <p className="text-sm font-medium text-brand-cyan">{member.role}</p>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed line-clamp-4">
              {member.bio}
            </p>
          </div>

          {/* LinkedIn */}
          <div className="w-full border-t border-border pt-4">
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Perfil de LinkedIn de ${member.name}`}
            >
              <Linkedin size={16} strokeWidth={1.5} aria-hidden="true" />
              LinkedIn
            </a>
          </div>
        </CardContent>
      </Card>
    </li>
  );
};

const TeamSection = async () => {
  const raw = await getFrontmatterOnly("team");
  const content = (raw || {}) as unknown as TeamContent;

  const {
    label = "",
    title = "",
    description = "",
    members = [],
  } = content;

  return (
    <section
      id="equipo"
      aria-labelledby="team-heading"
      className="section-padding bg-muted/30 overflow-hidden scroll-mt-20"
    >
      <div className="container-content px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-[var(--space-xl)] text-center">
          {label && (
            <Badge variant="accent" className="mb-4">
              {label}
            </Badge>
          )}
          <h2
            id="team-heading"
            className="font-bold text-foreground"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            {title}
          </h2>
          {description && (
            <p
              className="mx-auto mt-4 max-w-2xl text-muted-foreground"
              style={{ fontSize: "var(--text-lg)" }}
            >
              {description}
            </p>
          )}
        </header>

        {/* Team grid */}
        <ul
          role="list"
          aria-label="Miembros del equipo"
          className="grid grid-cols-1 gap-[var(--space-lg)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {members.map((member, index) => (
            <TeamMemberCard key={member.name} member={member} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TeamSection;
