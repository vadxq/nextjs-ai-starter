import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "~/styles/globals.css";
import { Toaster } from "~/components/ui/sonner"
import { ThemeProvider } from "~/components/provider/themeProvider"
import { routing } from "~/lib/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 防止闪烁 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var savedTheme = localStorage.getItem('theme')
                var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                var theme = savedTheme || 'system'
                var resolved = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme
                document.documentElement.classList.add(resolved)
                document.documentElement.style.colorScheme = resolved
              })()
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
