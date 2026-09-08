import { endpoint, requireOwner } from "@/lib/http";
import { mailFor } from "@/lib/resend";
import { csv } from "@/lib/content";
export const maxDuration = 60;
export const GET = endpoint(async () => {
  const { publication } = await requireOwner();
  const contacts = await mailFor(publication, false).contacts(
    publication.segmentId!,
  );
  return new Response(
    csv([
      ["Email", "Status", "Subscribed at"],
      ...contacts.map((c) => [
        c.email,
        c.unsubscribed ? "Unsubscribed" : "Subscribed",
        c.created_at,
      ]),
    ]),
    {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="caveat-subscribers.csv"',
        "Cache-Control": "no-store",
      },
    },
  );
});
