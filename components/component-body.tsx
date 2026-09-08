import type { ComponentAttributes } from "@/lib/newsletter-components";

export function ComponentBody({ value }: { value: ComponentAttributes }) {
  const { kind, title, body, label, url, attribution } = value;
  return <div data-caveat-component={kind} className={`publication-component component-${kind}`}>
    {kind === "callout" && <aside><strong>{title}</strong><p>{body}</p></aside>}
    {kind === "quote" && <blockquote><p>{body}</p>{attribution && <cite>{attribution}</cite>}</blockquote>}
    {kind === "button" && <p><a className="component-action" href={url} target="_blank" rel="noopener noreferrer">{label}</a></p>}
    {kind === "link-card" && <aside><strong><a href={url} target="_blank" rel="noopener noreferrer">{title || url}</a></strong><p>{body}</p></aside>}
    {kind === "divider" && <hr />}
  </div>;
}
