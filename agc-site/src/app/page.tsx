import { workContent, fallbackNews, fallbackEvents } from "@/data/content";
import { getHomePageCms } from "@/lib/home-page-data";
import { getEvents, getNews, getPartners } from "@/lib/content";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import type { CmsNews, CmsEvent } from "@/lib/content";
import { Button } from "@/components/Button";
import { HeroConsultar } from "@/components/HeroConsultar";
import { HeroFeaturesOverlap } from "@/components/HeroFeaturesOverlap";
import { HomePartnerStrip } from "@/components/HomePartnerStrip";
import { HomeSpotlightStory } from "@/components/HomeSpotlightStory";
import { NewsCard } from "@/components/NewsCard";
import { HomeEventsSection } from "@/components/HomeEventsSection";
import { resolveImageUrl } from "@/lib/media";
import { resolveEventsForPublic, resolveNewsForPublic } from "@/lib/cms-fallback";
import { CmsDraftNotice } from "@/components/CmsDraftNotice";

export const revalidate = 30;

type OurWorkCms = typeof workContent & {
  heroImage?: string;
  homePillarIntro?: string;
  pillarReadMoreLabel?: string;
  pillarCardImages?: { programs?: string; projects?: string; advisory?: string };
};

export default async function HomePage() {
  const workFallback = cmsStaticOrEmpty(workContent as OurWorkCms);

  const [events, news, home, partnersFromDb, workMerged] = await Promise.all([
    getEvents(),
    getNews(6),
    getHomePageCms(),
    getPartners(),
    getMergedPageContent<OurWorkCms>("our-work", workFallback),
  ]);

  const { items: eventsList, cmsDraftsOnly: homeEventsDrafts } = await resolveEventsForPublic(
    events,
    fallbackEvents as CmsEvent[]
  );
  const { items: newsList, cmsDraftsOnly: homeNewsDrafts } = await resolveNewsForPublic(
    news,
    fallbackNews as CmsNews[]
  );
  const allEventsRaw: CmsEvent[] = eventsList;
  const allEvents: CmsEvent[] = await Promise.all(
    allEventsRaw.map(async (e) => ({
      ...e,
      image: (await resolveImageUrl(e.image)) || undefined,
    }))
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pastEvents = allEvents.filter((e) => new Date(e.end_date || e.start_date) < today).slice(0, 3);
  const upcomingEvents = allEvents.filter((e) => new Date(e.end_date || e.start_date) >= today).slice(0, 3);
  const latestNewsRaw: CmsNews[] = newsList.slice(0, 3);
  const latestNews = await Promise.all(
    latestNewsRaw.map(async (n) => ({
      item: n,
      imageUrl: (await resolveImageUrl(n.image)) || undefined,
    }))
  );

  const heroSlides = home.heroSliderImages ?? [];
  const stripPartners =
    partnersFromDb.length > 0
      ? await Promise.all(
          partnersFromDb.map(async (p) => ({
            name: p.name,
            logo: (await resolveImageUrl(p.logo)) || undefined,
            url: p.url,
          }))
        )
      : home.heroPartnerStrip.map((name) => ({ name }));

  const pillarImages = workMerged.pillarCardImages ?? {};
  const pillarCards = [
    {
      title: workMerged.programs?.title ?? "",
      description: workMerged.programs?.description ?? "",
      href: "/our-work/programs",
      image: (await resolveImageUrl(pillarImages.programs)) || undefined,
    },
    {
      title: workMerged.projects?.title ?? "",
      description: workMerged.projects?.description ?? "",
      href: "/our-work/projects",
      image: (await resolveImageUrl(pillarImages.projects)) || undefined,
    },
    {
      title: workMerged.advisory?.title ?? "",
      description: workMerged.advisory?.description ?? "",
      href: "/our-work/advisory",
      image: (await resolveImageUrl(pillarImages.advisory)) || undefined,
    },
  ].filter((c) => c.title.trim() && c.description.trim());

  const impactStats = home.homeImpactStats.filter((s) => s.value?.trim() || s.label?.trim() || s.note?.trim());
  const showReach = Boolean(home.homeReach.title?.trim());
  const showMethodology = Boolean(home.homeImpactMethodology?.trim());
  const showCtaBand = Boolean(home.homeCtaBand.title?.trim());
  const showAppSummitTeaser = Boolean(home.homeAppSummitTeaser.title?.trim());
  const showNewsHead = Boolean(home.homeNewsTeaser.title?.trim() || home.homeNewsTeaser.subtitle?.trim());

  return (
    <>
      <HeroConsultar
        hero={home.heroContent}
        sliderImages={heroSlides}
        backgroundVideoSrc="/media/hero-video-background.mp4"
      />

      {(homeEventsDrafts || homeNewsDrafts) && (
        <div className="border-b border-amber-200/80 bg-amber-50/95">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
            <CmsDraftNotice entityLabel="news or events" adminHref="/admin" />
          </div>
        </div>
      )}

      <HeroFeaturesOverlap
        intro={workMerged.homePillarIntro ?? ""}
        readMoreLabel={workMerged.pillarReadMoreLabel?.trim() ?? ""}
        cards={pillarCards}
      />

      <HomePartnerStrip blurb={home.homePartnerBlurb} partners={stripPartners} />

      <div className="h-10 bg-[#fffcf7] sm:h-12" aria-hidden />

      {(showReach || impactStats.length > 0 || showMethodology) && (
        <section className="border-y border-stone-200/80 bg-[#f2ebe3]/60 py-14 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            {showReach && (
              <div className="mb-12 max-w-2xl lg:max-w-xl">
                <h2 className="font-serif text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                  {home.homeReach.title}
                </h2>
                <p className="mt-3 text-[17px] leading-relaxed text-stone-600">{home.homeReach.intro}</p>
              </div>
            )}
            {impactStats.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {impactStats.map((stat, i) => (
                  <div
                    key={`${stat.label}-${i}`}
                    className="rounded-2xl border border-stone-200/70 bg-[#fffcf7] p-6 shadow-sm"
                  >
                    <p className="font-sans text-3xl font-semibold tabular-nums tracking-tight text-accent-800">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm font-medium text-stone-900">{stat.label}</p>
                    <p className="mt-2 text-xs leading-relaxed text-stone-500">{stat.note}</p>
                  </div>
                ))}
              </div>
            )}
            {showMethodology && (
              <p className="mt-10 max-w-2xl text-sm italic leading-relaxed text-stone-600">{home.homeImpactMethodology}</p>
            )}
          </div>
        </section>
      )}

      <HomeSpotlightStory story={home.homeSpotlightStory} />

      {home.homeTestimonial.quote?.trim() ? (
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-4xl gap-8 rounded-2xl border border-stone-200/80 bg-[#faf6ef] p-8 sm:grid-cols-[auto_1fr] sm:gap-10 sm:p-10">
              <div
                className="mx-auto flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent-100 font-sans text-2xl font-semibold text-accent-900 sm:mx-0"
                aria-hidden
              >
                {home.homeTestimonial.initials}
              </div>
              <blockquote className="min-w-0">
                <p className="font-serif text-xl leading-snug text-stone-800 sm:text-2xl sm:leading-snug">
                  &ldquo;{home.homeTestimonial.quote}&rdquo;
                </p>
                <footer className="mt-8 border-t border-stone-300/60 pt-6">
                  <cite className="not-italic">
                    <span className="font-semibold text-stone-900">{home.homeTestimonial.name}</span>
                    <span className="mt-1 block text-sm text-stone-600">
                      {home.homeTestimonial.title}, {home.homeTestimonial.organization}
                    </span>
                  </cite>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>
      ) : null}

      {showCtaBand && (
        <section className="relative overflow-hidden bg-accent-900 py-16 sm:py-20 lg:py-24">
          <div
            className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent-600/20 blur-3xl"
            aria-hidden
          />
          <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-500/15 blur-3xl" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
            <div className="lg:col-span-5 lg:pt-1">
              {home.homeCtaBand.eyebrow?.trim() ? (
                <p className="text-sm font-medium text-accent-200">{home.homeCtaBand.eyebrow}</p>
              ) : null}
              <h2 className="mt-4 font-serif text-2xl font-semibold leading-snug text-white sm:text-3xl lg:text-[1.85rem] lg:leading-tight">
                {home.homeCtaBand.title}
              </h2>
            </div>
            <div className="flex flex-col justify-center border-t border-white/10 pt-10 lg:col-span-7 lg:border-l lg:border-t-0 lg:border-white/10 lg:pl-14 lg:pt-0">
              {home.homeCtaBand.body?.trim() ? (
                <p className="text-[17px] leading-[1.7] text-accent-100/90">{home.homeCtaBand.body}</p>
              ) : null}
              <div className="mt-9 flex flex-wrap gap-3">
                {home.homeCtaBand.primaryCta?.trim() ? (
                  <Button
                    asChild
                    href={home.homeCtaBand.primaryHref || "/get-involved"}
                    variant="primary"
                    size="lg"
                    className="rounded-xl bg-white text-accent-900 shadow-md hover:bg-accent-50"
                  >
                    {home.homeCtaBand.primaryCta}
                  </Button>
                ) : null}
                {home.homeCtaBand.secondaryCta?.trim() ? (
                  <Button
                    asChild
                    href={home.homeCtaBand.secondaryHref || "/about"}
                    variant="outline"
                    size="lg"
                    className="rounded-xl border-stone-400/50 text-white hover:bg-white/10"
                  >
                    {home.homeCtaBand.secondaryCta}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      )}

      {showAppSummitTeaser && (
        <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">{home.homeAppSummitTeaser.title}</h2>
                {home.homeAppSummitTeaser.description?.trim() ? (
                  <p className="mt-2 text-slate-600">{home.homeAppSummitTeaser.description}</p>
                ) : null}
              </div>
              {home.homeAppSummitTeaser.ctaLabel?.trim() ? (
                <Button asChild href={home.homeAppSummitTeaser.ctaHref || "/app-summit"} variant="outline">
                  {home.homeAppSummitTeaser.ctaLabel}
                </Button>
              ) : null}
            </div>
          </div>
        </section>
      )}

      <HomeEventsSection pastEvents={pastEvents} upcomingEvents={upcomingEvents} />

      <section className="border-t border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {showNewsHead && (
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">{home.homeNewsTeaser.title}</h2>
              {home.homeNewsTeaser.subtitle?.trim() ? (
                <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">{home.homeNewsTeaser.subtitle}</p>
              ) : null}
            </div>
          )}
          {latestNews.length > 0 ? (
            <div className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 ${showNewsHead ? "mt-12" : ""}`}>
              {latestNews.map(({ item, imageUrl }) => (
                <NewsCard key={item.id} item={item} imageUrl={imageUrl} href="/news" />
              ))}
            </div>
          ) : (
            <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center ${showNewsHead ? "mt-12" : ""}`}>
              <p className="text-slate-600">No published news yet.</p>
              <Button asChild href="/news" variant="outline" className="mt-6">
                News archive
              </Button>
            </div>
          )}
          <div className="mt-12 text-center">
            <Button asChild href="/news" variant="outline">
              View all news
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
