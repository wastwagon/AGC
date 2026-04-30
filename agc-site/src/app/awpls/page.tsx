import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { placeholderImages } from "@/data/images";
import { preferUnoptimizedImage } from "@/lib/image-delivery";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { cardImageUrlOrNull } from "@/lib/image-delivery";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "African Women Political Leadership Summit (AWPLS)",
  description:
    "African Women Political Leadership Summit — strengthening women’s leadership in political life across the continent.",
};

export const revalidate = 60;

const awplsFallback = {
  title: "African Women Political Leadership Summit",
  subtitle: "AWPLS",
  description:
    "The African Women Political Leadership Summit (AWPLS) brings together women in and around political life to share evidence, build skills, and strengthen how parties and institutions govern. Programme details, dates, and registration will be announced here.",
  heroImage: "/uploads/placeholder.svg",
};

export default async function AwplsPage() {
  const [siteSettings, content] = await Promise.all([
    getSiteSettings(),
    getMergedPageContent<typeof awplsFallback>("awpls", cmsStaticOrEmpty(awplsFallback)),
  ]);
  const contentMap = content as Record<string, unknown>;
  const getImageRef = (key: string) =>
    typeof contentMap[key] === "string" ? String(contentMap[key]) : undefined;

  const heroSrc =
    cardImageUrlOrNull((await resolveImageUrl(content.heroImage)) ?? null) ?? placeholderImages.about;
  const sectionDescription = content.description?.trim() || awplsFallback.description;
  const [introImage, sectionImageA, sectionImageB, sectionImageC] = await Promise.all([
    resolveImageUrl(getImageRef("introImage")),
    resolveImageUrl(getImageRef("sectionImageA")),
    resolveImageUrl(getImageRef("sectionImageB")),
    resolveImageUrl(getImageRef("sectionImageC")),
  ]);
  const introVisual = introImage || placeholderImages.about;
  const galleryVisuals = [
    sectionImageA || placeholderImages.events,
    sectionImageB || placeholderImages.events,
    sectionImageC || placeholderImages.events,
  ];
  const targetsBgImage = getImageRef("targetsBgImage") || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=2200&q=80";
  const deliverBgImage = getImageRef("deliverBgImage") || "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=2200&q=80";

  return (
    <>
      <PageHero
        variant="immersive"
        title={content.title}
        subtitle={content.subtitle}
        image={heroSrc}
        imageAlt="African Women Political Leadership Summit"
        breadcrumbs={[
          { label: siteSettings.chrome.breadcrumbs.home, href: "/" },
          { label: "AWPLS" },
        ]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="w-full border-t border-border/80 bg-white py-10 sm:py-14 lg:py-16">
          <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
            <div className="grid gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-accent-800">AWPLS</p>
                <h2 className="mt-3 font-serif text-[2rem] font-semibold leading-tight text-black sm:text-[2.5rem]">
                  A strategic platform for women’s political leadership in Africa
                </h2>
                <p className="mt-6 page-prose text-[1.08rem] font-medium leading-relaxed text-stone-800">
                  {sectionDescription}
                </p>
                <p className="mt-4 page-prose text-[1.08rem] font-medium leading-relaxed text-stone-800">
                  AWPLS is a strategic platform for action that links senior-level deliberation to concrete policy output,
                  research, institutional reform, and economic empowerment. It serves women who lead and seek to lead,
                  institutions that shape leadership conditions, and partners who invest in making that leadership possible.
                </p>
              </div>
              <div className="self-start rounded-none border border-border/90 bg-white p-6 shadow-sm">
                <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  <Image
                    src={introVisual}
                    alt="AWPLS visual"
                    fill
                    className="object-cover"
                    unoptimized={preferUnoptimizedImage(introVisual)}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <h3 className="font-serif text-xl font-semibold text-black">Secure your spot at AWPLS 2026</h3>
                <p className="mt-2 text-sm text-black">
                  Register now to join high-level dialogues, ministerial roundtables, and continental leadership partnerships.
                </p>
                <Button asChild href="/contact" variant="primary" className="mt-5 w-full rounded-none bg-accent-600 hover:bg-accent-700">
                  Register Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      </HomeScrollReveal>

      <section className="w-full border-t border-border/80 bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <div className="mb-7 grid gap-4 md:grid-cols-3">
            {galleryVisuals.map((img, i) => (
              <div key={`${img}-${i}`} className="relative aspect-[16/10] overflow-hidden border border-border/80 bg-stone-100">
                <Image
                  src={img}
                  alt={`AWPLS section visual ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={preferUnoptimizedImage(img)}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
          <h2 className="font-serif text-[1.9rem] font-semibold text-black sm:text-[2.3rem]">What AWPLS Is</h2>
          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            <article className="rounded-none border border-border/80 p-6">
              <h3 className="font-sans text-xl font-semibold text-black">1. A high-level convening space</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-black">
                AWPLS brings together heads of state, parliamentarians, cabinet ministers, party executives, and senior
                technocrats to deliberate on governance challenges and chart collective responses.
              </p>
            </article>
            <article className="rounded-none border border-border/80 p-6">
              <h3 className="font-sans text-xl font-semibold text-black">2. A platform for redefining leadership</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-black">
                AWPLS reframes women&apos;s authority in politics as central to democratic legitimacy and economic transformation.
              </p>
            </article>
            <article className="rounded-none border border-border/80 p-6">
              <h3 className="font-sans text-xl font-semibold text-black">3. A research and policy production body</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-black">
                The Summit generates gender-disaggregated research and policy briefs to inform the African Union, national
                governments, RECs, and development partners.
              </p>
            </article>
            <article className="rounded-none border border-border/80 p-6">
              <h3 className="font-sans text-xl font-semibold text-black">4. A leadership development ecosystem</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-black">
                Through fellowships, leadership academies, mentorship networks, and peer learning programmes, AWPLS aims
                to train and mentor more than 2,000 women leaders by 2030.
              </p>
            </article>
            <article className="rounded-none border border-border/80 p-6 lg:col-span-2">
              <h3 className="font-sans text-xl font-semibold text-black">5. An economic empowerment mechanism</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-black">
                AWPLS aligns policy, capital, and institutional authority with women-led growth by convening ministers of
                trade, finance institutions, and public finance bodies.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="w-full border-t border-border/80 bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <div
            className="rounded-none border border-border/80 bg-cover bg-center bg-no-repeat px-6 py-10 text-white sm:px-10"
            style={{
              backgroundImage:
                `linear-gradient(180deg, rgba(28,18,12,0.2) 0%, rgba(10,9,10,0.66) 55%, rgba(4,5,6,0.9) 100%), radial-gradient(circle at 72% 28%, rgba(195,122,73,0.24), transparent 44%), url('${targetsBgImage}')`,
            }}
          >
            <h2 className="font-serif text-[1.9rem] font-semibold sm:text-[2.3rem]">Targets</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              <li className="rounded-none border border-white/20 bg-white/5 p-4 text-sm">2,000+ women leaders trained by 2030</li>
              <li className="rounded-none border border-white/20 bg-white/5 p-4 text-sm">54 African Union member states engaged</li>
              <li className="rounded-none border border-white/20 bg-white/5 p-4 text-sm">3 core pillars: policy, leadership, economy</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="w-full border-t border-border/80 bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <h2 className="font-serif text-[1.9rem] font-semibold text-black sm:text-[2.3rem]">
            About the 2026 Africa Women Political Leadership Summit
          </h2>
          <p className="mt-5 page-prose text-[1.08rem] font-medium leading-relaxed text-stone-800">
            Under the theme <strong>&ldquo;Women in Power: Political Leadership for Africa&apos;s Economic Transformation&rdquo;</strong>,
            AWPLS 2026 is designed as a high-impact, action-oriented convening that moves beyond dialogue to deliver concrete
            policy commitments, institutional frameworks, and transformative partnerships.
          </p>
          <p className="mt-4 page-prose text-[1.08rem] font-medium leading-relaxed text-stone-800">
            The 2026 edition, scheduled for November 2026, builds on the inaugural Accra summit and positions Africa to lead
            the global conversation on women&apos;s political leadership and economic governance.
          </p>
        </div>
      </section>

      <section
        className="w-full border-t border-border/80 bg-cover bg-center bg-no-repeat py-10 sm:py-14 lg:py-16"
        style={{
          backgroundImage:
            `linear-gradient(180deg, rgba(24,16,12,0.24) 0%, rgba(10,9,10,0.68) 54%, rgba(5,5,6,0.9) 100%), radial-gradient(circle at 70% 24%, rgba(195,122,73,0.22), transparent 46%), url('${deliverBgImage}')`,
        }}
      >
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <h2 className="font-serif text-[1.9rem] font-semibold text-white sm:text-[2.3rem]">What AWPLS 2026 Will Deliver</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Establish a High-Level Advisory Council to strengthen women's leadership capacity in governance, economic policy, fiscal strategy, and industrial development.",
              "Forge an Intergenerational Leadership Compact bridging emerging and established women leaders across Africa.",
              "Adopt the Addis Ababa Declaration on Women's Political Leadership for Africa's Economic Transformation.",
              "Launch the African Women Leadership and Transformation Fund to sustain long-term initiatives beyond the Summit.",
              "Convene Ministerial Roundtables and Expert Policy Dialogues on inclusive governance, electoral reform, and accountability.",
              "Host the AWPLS Leadership Excellence Awards & Gala Night celebrating trailblazing women in governance.",
              "Produce the AWPLS 2026 Policy Brief as a continental reference document on women’s leadership in economic governance.",
            ].map((item) => (
              <li
                key={item}
                className="rounded-none border border-white/70 bg-white/88 p-5 text-sm font-medium leading-relaxed text-black shadow-[0_8px_24px_-16px_rgba(15,23,42,0.35)] backdrop-blur-[1px]"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 page-prose text-[1.02rem] font-medium leading-relaxed text-white/90">
            Together, these initiatives ensure the Summit evolves into an institution that works with governments,
            continental bodies, political parties, research centres, the private sector, and development partners.
          </p>
        </div>
      </section>

      <section className="w-full border-t border-border/80 bg-white py-12 sm:py-16">
        <div className="mx-auto w-full max-w-4xl px-6 sm:px-8 lg:px-11">
          <div className="rounded-none border border-border/80 bg-white p-8 sm:p-10">
            <h2 className="font-serif text-3xl font-semibold text-black">Secure your spot at AWPLS 2026</h2>
            <p className="mt-3 text-sm text-black">Join leaders, policymakers, and partners shaping Africa’s future.</p>
            <div className="mt-6">
              <Button asChild href="/contact" variant="primary" className="rounded-none bg-accent-700 hover:bg-accent-800">
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
