"use client";

import { usePathname } from "next/navigation";
import { Navbar, LocalNav, MegaFooter } from "@asclepius/ui";
import { STORE_URL as store } from "@/lib/store";

// authOS lives on auth.bhmhlth.com, so the bar's links point back at the store.
const links = [
  { href: `${store}/shop`, label: "Store" },
  { href: `${store}/campaign`, label: "Group Buy" },
  { href: `${store}/angiogenic`, label: "Angiogenic" },
  { href: `${store}/bioregulator`, label: "Bioregulator" },
  { href: `${store}/blends`, label: "Blends" },
  { href: `${store}/glp`, label: "GLP-1" },
  { href: `${store}/mito`, label: "MITO/MDPs" },
  { href: `${store}/nootropic`, label: "Nootropic" },
  { href: `${store}/repository`, label: "Repository" },
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/signup") return <>{children}</>;

  return (
    <>
      <Navbar links={links} homeHref={store} bag={{ href: `${store}/bag` }} />
      <LocalNav />
      <div className="flex-1">{children}</div>
      <MegaFooter baseUrl={store} authUrl="" />
    </>
  );
}
