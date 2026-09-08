import { ownerPage } from "@/lib/http";
import { SettingsForm } from "@/components/settings-form";
export default async function Settings({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { publication: p } = await ownerPage();
  const { welcome } = await searchParams;
  return (
    <div className="dashboard-page">
      <p className="eyebrow">
        {welcome ? "One last thing" : "Your publication"}
      </p>
      <h1>{welcome ? "Give it a name." : "The details that make it yours."}</h1>
      <p className="muted">
        {welcome
          ? "You can change all of this later."
          : "Keep the writing simple. Make the rest feel like you."}
      </p>
      <SettingsForm
        welcome={!!welcome}
        initial={{
          name: p.name,
          description: p.description,
          author: p.author,
          accent: p.accent,
          font: p.font,
          senderEmail: p.senderEmail,
          sendingReady: p.sendingReady,
          connected: !!p.resendKey,
        }}
      />
    </div>
  );
}
