import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import "@/styles/quill-custom.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import { prisma } from "@/lib/prisma";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl: string | undefined;
  try {
    const config = await prisma.globalConfig.findFirst({
      select: { favicon: true },
    });
    if (config?.favicon?.trim()) {
      faviconUrl = config.favicon.trim();
    }
  } catch {
    // Database connection or table error fallback
  }

  return {
    title: "Kokalachi CMS",
    description: "Manage your Kokalachi travel website content, trips, and bookings",
    ...(faviconUrl
      ? {
          icons: {
            icon: [{ url: faviconUrl }],
            shortcut: [{ url: faviconUrl }],
            apple: [{ url: faviconUrl }],
          },
        }
      : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  let faviconUrl: string | null = null;
  try {
    const config = await prisma.globalConfig.findFirst({
      select: { favicon: true },
    });
    faviconUrl = config?.favicon?.trim() || null;
  } catch {
    faviconUrl = null;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {faviconUrl && (
          <>
            <link rel="icon" href={faviconUrl} />
            <link rel="shortcut icon" href={faviconUrl} />
            <link rel="apple-touch-icon" href={faviconUrl} />
          </>
        )}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#f8f9fa]`}
        suppressHydrationWarning
      >
        <SessionProvider session={session}>
          {session ? (
            <div className="flex h-screen overflow-hidden font-sans p-[5px]">
              <AdminSidebar favicon={faviconUrl} />
              <main className="flex-1 overflow-y-auto">
                <div className="px-12 py-10">{children}</div>
              </main>
            </div>
          ) : (
            <div className="font-sans">{children}</div>
          )}
        </SessionProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: "var(--font-inter)", fontSize: "14px" },
            error: {
              style: {
                background: "#fff0f0",
                color: "#b91c1c",
                border: "1px solid #fecaca",
              },
            },
            success: {
              style: {
                background: "#f0fdf4",
                color: "#15803d",
                border: "1px solid #bbf7d0",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
