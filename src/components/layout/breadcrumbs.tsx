import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ crumbs, label, dark }: { crumbs: Crumb[]; label: string; dark?: boolean }) {
  return (
    <>
      <nav aria-label={label} className={cn("mb-6 text-sm", dark ? "text-soft" : "text-body")}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-1.5">
                {i > 0 ? <ChevronRight className="rtl-flip size-3.5 opacity-60" aria-hidden="true" /> : null}
                {last ? (
                  <span aria-current="page" className={cn("font-medium", dark ? "text-white" : "text-ink")}>{c.name}</span>
                ) : (
                  <Link href={c.path} className={cn("inline-flex min-h-8 items-center underline-offset-4 hover:underline", dark && "hover:text-white")}>
                    {c.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
