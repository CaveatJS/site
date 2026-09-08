"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="simple-auth">
      <section className="auth-card">
        <h1>A small interruption.</h1>
        <p>
          We could not load your publication. If this is a new installation,
          check the database connection and deployment logs.
        </p>
        <button className="button primary" onClick={reset}>
          Try again
        </button>
      </section>
    </main>
  );
}
