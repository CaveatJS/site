import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDesign, newsletterDesigns } from "@/lib/newsletter-designs";
import { readAppearance } from "@/lib/appearance";
import { DesignPreview } from "@/components/design-preview";
export function generateStaticParams() {
  return newsletterDesigns.map((d) => ({ slug: d.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return { title: getDesign((await params).slug)?.name ?? "Design not found" };
}
export default async function Example({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const design = getDesign((await params).slug);
  if (!design) notFound();
  return (
    <DesignPreview
      design={design}
      appearance={await readAppearance()}
      canApply={process.env.NODE_ENV === "development"}
    />
  );
}
