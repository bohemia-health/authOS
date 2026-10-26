import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import {
  Navbar,
  LocalNav,
  NavChromeProvider,
  MegaFooter,
  BreadcrumbProvider,
} from "@asclepius/ui";
import { STORE_URL as store } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bohemia Health",
  description: "SSO User Authentication Portal",
};

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BreadcrumbProvider>
            <NavChromeProvider>
              <Navbar links={links} homeHref={store} bag={{ href: `${store}/bag` }} />
              <LocalNav />
              <div className="flex-1">{children}</div>
              <MegaFooter baseUrl={store} authUrl="" />
            </NavChromeProvider>
          </BreadcrumbProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
