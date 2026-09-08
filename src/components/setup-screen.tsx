import { Logo } from "./ui";
import { AuthForm } from "./auth-form";
export function SetupScreen({ configured = true }: { configured?: boolean }) {
  return (
    <main id="main" className="auth-page">
      <div className="auth-story">
        <Logo />
        <div>
          <p className="eyebrow">A little space. A lot to say.</p>
          <h1>
            Your words.
            <br />
            Your corner
            <br />
            <em>of the internet.</em>
          </h1>
          <p>
            A website and a newsletter, with a quiet place to write. Make it
            yours.
          </p>
        </div>
        <span className="quiet">Made with Caveat</span>
      </div>
      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">Welcome to Caveat</p>
          <h2>Make yourself at home.</h2>
          {configured ? (
            <>
              <p className="muted">
                Create your owner account. You can name your publication next.
              </p>
              <AuthForm mode="setup" />
            </>
          ) : (
            <>
              <p>Connect your database to finish installation.</p>
              <ol className="instructions">
                <li>In Vercel, open Storage and add Prisma Postgres.</li>
                <li>
                  Add private <code>BETTER_AUTH_SECRET</code> and{" "}
                  <code>CAVEAT_SETUP_KEY</code> values, each at least 32 random
                  characters.
                </li>
                <li>Redeploy, then return here.</li>
              </ol>
              <p className="muted">
                Developing locally? Run <code>npm run dev</code> to set
                everything up.
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
