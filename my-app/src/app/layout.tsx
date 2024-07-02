import "./globals.css";
import { Space_Mono, Roboto as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

const fontMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
});

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "700"],
});

export const metadata = {
  title: "Skill-Bridge",
  description:
    "A website for people and freelancers to hire and work with each other in the world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
