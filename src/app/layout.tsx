import type { Metadata, Viewport } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import PWARegistration from "./components/shared/PWARegistration";
import { ThemeProvider } from "./components/providers/ThemeProvider";

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your daily progress and build lasting streaks.",
  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Habit Tracker",
  },
};

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-league-spartans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${leagueSpartan.variable}} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider>
          <PWARegistration />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
