import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/ui";
export default function Login() {
  return (
    <main id="main" className="simple-auth">
      <Logo />
      <section className="auth-card">
        <p className="eyebrow">Your writing desk</p>
        <h1>Welcome back.</h1>
        <p className="muted">A little time to put your thoughts into words.</p>
        <AuthForm mode="login" />
      </section>
    </main>
  );
}
