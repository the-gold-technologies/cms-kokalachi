import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import "@/styles/quill-custom.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/app/components/Sidebar";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Mahalaxmi Enterprises CMS",
  description: "Manage your HP Lubricants website content and distributor portal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#f8f9fa]`}
        suppressHydrationWarning
      >
        <SessionProvider session={session}>
          {session ? (
            <div className="flex h-screen overflow-hidden font-sans p-[5px]">
              <AdminSidebar />
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
