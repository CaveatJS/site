"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  PencilEdit02Icon,
  RssIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";

const icons = {
  add: Add01Icon,
  back: ArrowLeft01Icon,
  forward: ArrowRight01Icon,
  arrow: ArrowUpRight01Icon,
  edit: PencilEdit02Icon,
  rss: RssIcon,
  preview: ViewIcon,
};

// Icons accompany visible labels; hide them from assistive technology.
export function Icon({ name, size = 18 }: { name: keyof typeof icons; size?: number }) {
  return <HugeiconsIcon icon={icons[name]} size={size} strokeWidth={1.6} color="currentColor" className="ui-icon" aria-hidden="true" focusable="false" />;
}
