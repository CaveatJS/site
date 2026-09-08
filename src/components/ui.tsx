import Link from "next/link";
export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link className="logo" href={href}>
      caveat<span aria-hidden="true">✳</span>
    </Link>
  );
}
export function Message({
  children,
  error = false,
}: {
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <p
      className={error ? "message error" : "message"}
      role={error ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
export function DateLabel({ date }: { date: Date | string }) {
  return (
    <time dateTime={new Date(date).toISOString()}>
      {new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })}
    </time>
  );
}
