"use client";

import { useFormStatus } from "react-dom";
import { updateHomePageContent } from "./actions-home";
import type { HomePageCms } from "@/lib/home-page-data";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-[44px] rounded-lg bg-accent-600 px-8 py-2.5 font-semibold text-white hover:bg-accent-700 disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save homepage"}
    </button>
  );
}

const input =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900";
const label = "block text-sm font-medium text-slate-700";
const ta = `${input} min-h-[80px]`;

export function HomePageContentForm({ data, status }: { data: HomePageCms; status: string }) {
  const s = data.homeSpotlightStory;
  const p0 = s.paragraphs[0] ?? "";
  const p1 = s.paragraphs[1] ?? "";

  return (
    <form action={updateHomePageContent} className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div>
          <p className="font-semibold text-slate-900">Homepage (public site)</p>
          <p className="text-sm text-slate-600">
            Hero, testimonial, fellow spotlight, reach copy, stats, and partner strip. Draft = live site uses code
            defaults until you publish.
          </p>
        </div>
        <div>
          <label htmlFor="status" className={label}>
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className={`${input} mt-1 min-w-[140px]`}
          >
            <option value="published">Published</option>
            <option value="draft">Draft (revert to defaults on site)</option>
          </select>
        </div>
      </div>

      <fieldset className="rounded-xl border border-slate-200 p-6">
        <legend className="px-2 text-lg font-semibold text-slate-900">Hero</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label}>Hero slider images (one URL per line)</label>
            <textarea
              name="hero_slider_images"
              rows={3}
              className={ta}
              placeholder="/uploads/hero1.jpg&#10;/uploads/hero2.jpg"
              defaultValue={data.heroSliderImages?.length ? data.heroSliderImages.join("\n") : ""}
            />
            <p className="mt-1 text-xs text-slate-500">Upload images in Media, then paste paths here (e.g. /uploads/hero.jpg). Leave empty to use default.</p>
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Eyebrow</label>
            <input name="hero_eyebrow" defaultValue={data.heroContent.eyebrow} className={input} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Title</label>
            <input name="hero_title" defaultValue={data.heroContent.title} className={input} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Subtitle</label>
            <textarea name="hero_subtitle" defaultValue={data.heroContent.subtitle} rows={4} className={ta} />
          </div>
          <div>
            <label className={label}>Primary CTA label</label>
            <input name="hero_cta" defaultValue={data.heroContent.cta} className={input} />
          </div>
          <div>
            <label className={label}>Primary CTA link</label>
            <input name="hero_ctaHref" defaultValue={data.heroContent.ctaHref} className={input} />
          </div>
          <div>
            <label className={label}>Secondary CTA label</label>
            <input name="hero_ctaSecondary" defaultValue={data.heroContent.ctaSecondary} className={input} />
          </div>
          <div>
            <label className={label}>Secondary CTA link</label>
            <input name="hero_ctaSecondaryHref" defaultValue={data.heroContent.ctaSecondaryHref} className={input} />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 p-6">
        <legend className="px-2 text-lg font-semibold text-slate-900">Testimonial</legend>
        <div className="mt-4 space-y-4">
          <div>
            <label className={label}>Quote</label>
            <textarea name="test_quote" defaultValue={data.homeTestimonial.quote} rows={5} className={ta} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Name</label>
              <input name="test_name" defaultValue={data.homeTestimonial.name} className={input} />
            </div>
            <div>
              <label className={label}>Initials (avatar)</label>
              <input name="test_initials" defaultValue={data.homeTestimonial.initials} className={input} maxLength={6} />
            </div>
            <div>
              <label className={label}>Title / role</label>
              <input name="test_title" defaultValue={data.homeTestimonial.title} className={input} />
            </div>
            <div>
              <label className={label}>Organisation</label>
              <input name="test_org" defaultValue={data.homeTestimonial.organization} className={input} />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 p-6">
        <legend className="px-2 text-lg font-semibold text-slate-900">Fellow / programme spotlight</legend>
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Section label</label>
              <input name="spot_label" defaultValue={s.label} className={input} />
            </div>
            <div>
              <label className={label}>Initials</label>
              <input name="spot_initials" defaultValue={s.initials} className={input} maxLength={6} />
            </div>
          </div>
          <div>
            <label className={label}>Headline</label>
            <input name="spot_headline" defaultValue={s.headline} className={input} />
          </div>
          <div>
            <label className={label}>Paragraph 1</label>
            <textarea name="spot_p1" defaultValue={p0} rows={4} className={ta} />
          </div>
          <div>
            <label className={label}>Paragraph 2</label>
            <textarea name="spot_p2" defaultValue={p1} rows={4} className={ta} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Fellow / subject name</label>
              <input name="spot_name" defaultValue={s.name} className={input} />
            </div>
            <div>
              <label className={label}>Role line</label>
              <input name="spot_role" defaultValue={s.role} className={input} />
            </div>
            <div>
              <label className={label}>CTA label</label>
              <input name="spot_ctaLabel" defaultValue={s.ctaLabel} className={input} />
            </div>
            <div>
              <label className={label}>CTA URL</label>
              <input name="spot_ctaHref" defaultValue={s.ctaHref} className={input} />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 p-6">
        <legend className="px-2 text-lg font-semibold text-slate-900">Reach section + stats</legend>
        <div className="mt-4 space-y-4">
          <div>
            <label className={label}>Section title</label>
            <input name="reach_title" defaultValue={data.homeReach.title} className={input} />
          </div>
          <div>
            <label className={label}>Section intro</label>
            <textarea name="reach_intro" defaultValue={data.homeReach.intro} rows={3} className={ta} />
          </div>
          {[0, 1, 2, 3].map((i) => {
            const st = data.homeImpactStats[i] ?? { value: "", label: "", note: "" };
            return (
              <div key={i} className="rounded-lg border border-slate-100 bg-slate-50/80 p-4">
                <p className="mb-2 text-sm font-medium text-slate-600">Stat {i + 1}</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className={label}>Value</label>
                    <input name={`stat${i}_value`} defaultValue={st.value} className={input} />
                  </div>
                  <div>
                    <label className={label}>Label</label>
                    <input name={`stat${i}_label`} defaultValue={st.label} className={input} />
                  </div>
                  <div className="sm:col-span-3">
                    <label className={label}>Note</label>
                    <input name={`stat${i}_note`} defaultValue={st.note} className={input} />
                  </div>
                </div>
              </div>
            );
          })}
          <div>
            <label className={label}>Methodology footnote</label>
            <textarea name="methodology" defaultValue={data.homeImpactMethodology} rows={2} className={ta} />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 p-6">
        <legend className="px-2 text-lg font-semibold text-slate-900">Partner strip</legend>
        <div className="mt-4 space-y-4">
          <div>
            <label className={label}>Intro blurb (left column)</label>
            <textarea name="partner_blurb" defaultValue={data.homePartnerBlurb} rows={3} className={ta} />
          </div>
          <div>
            <label className={label}>Partner lines (one per line)</label>
            <textarea
              name="partners"
              defaultValue={data.heroPartnerStrip.join("\n")}
              rows={6}
              className={ta}
              placeholder="African Union frameworks&#10;National reform teams"
            />
          </div>
        </div>
      </fieldset>

      <SubmitButton />
    </form>
  );
}
