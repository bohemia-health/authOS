import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import {
  NavChromeProvider,
  BreadcrumbProvider,
} from "@asclepius/ui";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bohemia Health",
  description: "SSO User Authentication Portal",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BreadcrumbProvider>
            <NavChromeProvider>
              <SiteChrome>{children}</SiteChrome>
            </NavChromeProvider>
          </BreadcrumbProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
