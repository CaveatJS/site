import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/ui";
export default function Forgot() {
  return (
    <main id="main" className="simple-auth">
      <Logo />
      <section className="auth-card">
        <h1>Find your way back.</h1>
        <p className="muted">
          Password reset uses your connected email provider. If email is not set
          up yet, use the owner recovery instructions in the project README.
        </p>
        <AuthForm mode="forgot" />
      </section>
    </main>
  );
}
