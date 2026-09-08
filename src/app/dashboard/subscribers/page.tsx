import { LinkArrow } from "@/components/link-arrow";
import { Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ownerPage } from "@/lib/http";
import { mailFor, type Contact } from "@/lib/resend";
import { DateLabel } from "@/components/ui";
export default async function Subscribers() {
  const { publication } = await ownerPage();
  let contacts: Contact[] = [];
  let failed = false;
  if (publication.resendKey && publication.segmentId) {
    try {
      contacts = await mailFor(publication, false).contacts(
        publication.segmentId,
      );
    } catch {
      failed = true;
    }
  }
  return (
    <div className="dashboard-page">
      <p className="eyebrow">The other side of the letter</p>
      <div className="page-heading">
        <div>
          <h1>Your readers.</h1>
          <p className="muted">People who want to hear what you have to say.</p>
        </div>
        {publication.sendingReady && (
          <a className="button" href="/api/export/subscribers">
            Export subscribers
          </a>
        )}
      </div>
      {!publication.sendingReady ? (
        <section className="empty-state panel">
          <Users size={30} />
          <h2>Make room for your first reader.</h2>
          <p>Connect email to add a subscribe form to your website.</p>
          <Link className="button primary" href="/dashboard/settings#email">
            Connect email <ArrowUpRight size={16} />
          </Link>
        </section>
      ) : failed ? (
        <div role="alert" className="message error">
          Could not load subscribers from Resend. Check your connection in
          Settings and refresh.
        </div>
      ) : (
        <>
          <div className="reader-count">
            <strong>{contacts.filter((c) => !c.unsubscribed).length}</strong>
            <span>subscribed readers</span>
          </div>
          {contacts.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Email address</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id}>
                      <td>{c.email}</td>
                      <td>
                        <span className="badge">
                          {c.unsubscribed ? "Unsubscribed" : "Subscribed"}
                        </span>
                      </td>
                      <td>
                        <DateLabel date={c.created_at} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Users size={28} />
              <h2>A good beginning.</h2>
              <p>Share your website. Your first subscriber will appear here.</p>
              <Link href="/" target="_blank">
                Visit your publication <LinkArrow />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
