import { ownerPage } from "@/lib/http";
import { Sidebar } from "@/components/sidebar";
export const dynamic = "force-dynamic";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { publication } = await ownerPage();
  return (
    <div className="app-shell">
      <Sidebar name={publication.name} author={publication.author} />
      <main id="main" className="workspace">
        {children}
      </main>
    </div>
  );
}
