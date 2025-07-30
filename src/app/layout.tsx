import type { Metadata, Viewport } from "next";
import Script from "next/script";
import ThemeProvider from "@/components/Provider/Theme";
import I18Provider from "@/components/Provider/I18n";
import Debugger from "@/components/Internal/Debugger";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const HEAD_SCRIPTS = process.env.HEAD_SCRIPTS as string;
const APP_NAME = "Bulldozer Brain";
const APP_DEFAULT_TITLE = "Bulldozer Brain";
const APP_TITLE_TEMPLATE = "%s - Bulldozer Brain";
const APP_DESCRIPTION =
  "Advanced research platform powered by Local 825 - International Union of Operating Engineers.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  icons: {
    icon: {
      type: "image/png",
      url: "/825-logo.png",
    },
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  minimumScale: 1.0,
  maximumScale: 1.0,
  viewportFit: "cover",
  userScalable: false,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="auto" suppressHydrationWarning>
      <head>
        {HEAD_SCRIPTS ? <Script id="headscript">{HEAD_SCRIPTS}</Script> : null}
        <Debugger />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18Provider>{children}</I18Provider>
        </ThemeProvider>
        <Toaster richColors toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
