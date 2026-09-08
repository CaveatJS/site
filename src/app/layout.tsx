import type { Metadata } from "next";
import "./font-faces.css";
import "./globals.css";
import "./product.css";
import "./examples/examples.css";
import "./create/design.css";
import "./components/components.css";
import "./font-picker.css";
import "@/themes/custom.css";
export const metadata: Metadata = {
  title: {
    default: "Caveat — a place for your writing",
    template: "%s · Caveat",
  },
  description:
    "Write, publish, and send a newsletter on infrastructure you own.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
