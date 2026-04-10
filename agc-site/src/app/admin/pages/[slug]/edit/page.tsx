import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminFormErrorSuspense } from "../../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { PageContentForm } from "../../PageContentForm";
import { HomePageContentForm } from "../../HomePageContentForm";
import { getHomePageCmsForEdit } from "@/lib/home-page-data";
import { requireAdminSession } from "@/lib/require-admin";
import { ensureMissingBaselinePageRows } from "@/lib/ensure-missing-page-rows";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function AdminPagesEditPage({ params }: Props) {
  await requireAdminSession();
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  if (decodedSlug === "site-settings") {
    redirect("/admin/site-settings");
  }

  if (decodedSlug === "home") {
    await prisma.pageContent.upsert({
      where: { slug: "home" },
      create: { slug: "home", title: "Homepage", status: "published" },
      update: {},
    });
    const item = await prisma.pageContent.findUnique({ where: { slug: "home" } });
    const merged = await getHomePageCmsForEdit();
    return (
      <div>
        <AdminPageHeader
          title="Edit homepage"
          description={
            <>
              Controls the hero, testimonial, fellow spotlight, reach/stats, and partner strip on{" "}
              <strong>/</strong>. Set to <em>Draft</em> to show code defaults on the live site.
            </>
          }
        />
        <AdminFormErrorSuspense />
        <AdminFormSuccessSuspense />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
          <HomePageContentForm data={merged} status={item?.status ?? "published"} />
        </div>
      </div>
    );
  }

  await ensureMissingBaselinePageRows();
  const item = await prisma.pageContent.findUnique({ where: { slug: decodedSlug } });
  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader
        title={`Edit page: ${item.title || item.slug}`}
        description="Update hero text, intros, and status. Draft pages keep built-in defaults on the live site until you publish."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <PageContentForm item={item} />
      </div>
    </div>
  );
}
