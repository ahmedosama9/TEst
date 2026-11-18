"use client";

import { Check, Link2, Mail, Share2 } from "lucide-react";
import { useState } from "react";
import { fmt } from "@/lib/utils";

type Labels = { title: string; copy: string; copied: string; shareOn: string; email: string };

/** Plain share links — no third-party scripts, nothing is loaded until the visitor clicks. */
export function ShareLinks({ url, title, labels }: { url: string; title: string; labels: Labels }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const networks = [
    { name: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: "X", href: `https://x.com/intent/post?url=${u}&text=${t}` },
  ];
  const pill = "inline-flex min-h-10 items-center gap-1.5 rounded-full border border-navy/20 bg-white px-4 text-sm font-medium text-ink hover:border-navy/60";

  return (
    <section aria-labelledby="share-title" className="mt-10">
      <h2 id="share-title" className="mb-3 flex items-center gap-2 text-lg"><Share2 className="size-5 text-teal-ink" aria-hidden="true" />{labels.title}</h2>
      <ul className="flex flex-wrap gap-2">
        {networks.map((n) => (
          <li key={n.name}>
            <a href={n.href} target="_blank" rel="noopener noreferrer nofollow" aria-label={fmt(labels.shareOn, { network: n.name })} className={pill}>
              <span dir="ltr">{n.name}</span>
            </a>
          </li>
        ))}
        <li>
          <a href={`mailto:?subject=${t}&body=${u}`} className={pill}><Mail className="size-4" aria-hidden="true" />{labels.email}</a>
        </li>
        <li>
          <button
            type="button"
            className={pill}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              } catch {
                /* clipboard unavailable */
              }
            }}
          >
            {copied ? <Check className="size-4 text-teal-ink" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
            <span role="status">{copied ? labels.copied : labels.copy}</span>
          </button>
        </li>
      </ul>
    </section>
  );
}
