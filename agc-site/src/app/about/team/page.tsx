import Image from "next/image";
import { aboutContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { getTeam } from "@/lib/content";
import { resolveImageUrl } from "@/lib/media";
import { PageHero } from "@/components/PageHero";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";
import { Button } from "@/components/Button";

export const metadata = {
  title: "Our Team",
  description: "Advisory Board, Management Team, Fellows, and Associate Fellows at Africa Governance Centre.",
};

export const revalidate = 60;

export default async function TeamPage() {
  const [teamMembers, bc] = await Promise.all([getTeam(), getBreadcrumbLabels()]);
  const membersWithImages = await Promise.all(
    teamMembers.map(async (member) => ({
      ...member,
      imageUrl: await resolveImageUrl(member.image ?? undefined),
    }))
  );

  return (
    <>
      <PageHero
        title="Our Team"
        subtitle="Advisory Board, Management Team, Fellows, and Associate Fellows"
        image={placeholderImages.about}
        imageAlt="Our Team"
        breadcrumbs={[
          { label: bc.home, href: "/" },
          { label: bc.about, href: "/about" },
          { label: bc.team },
        ]}
      />

      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          {membersWithImages.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {membersWithImages.map((member) => {
                const imageUrl = member.imageUrl;
                return (
                  <article
                    key={member.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative h-56 bg-slate-100">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl text-slate-400">👤</div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-lg font-bold text-slate-900">{member.name}</h3>
                      {member.role && <p className="mt-1 text-sm font-medium text-accent-600">{member.role}</p>}
                      {member.bio && <p className="mt-3 text-sm text-slate-600 line-clamp-4">{member.bio}</p>}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12">
              <h2 className="font-serif text-xl font-bold text-slate-900">Team Structure</h2>
              <p className="mt-2 text-slate-600">
                Our team comprises experts across governance, policy, and research. Team members are managed through our
                CMS and will appear here when added.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {aboutContent.teamSections.map((section) => (
                  <span
                    key={section}
                    className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm"
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 flex flex-wrap gap-4">
            <Button asChild href="/about" variant="outline">
              Back to About Us
            </Button>
            <Button asChild href="/get-involved" variant="primary">
              Get Involved
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
