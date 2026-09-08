import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/ui";
export default async function Reset({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <main id="main" className="simple-auth">
      <Logo />
      <section className="auth-card">
        <h1>A fresh start.</h1>
        <AuthForm mode="reset" resetToken={token} />
      </section>
    </main>
  );
}
