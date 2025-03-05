import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `GA4 Dashboard`,
  description: `Explore a powerful GA4 dashboard built with Next.js and seamlessly deployed on Vercel. This dynamic, high-performance dashboard provides real-time insights into your website's traffic, user behavior, and key metrics. Built using the latest web technologies, it offers a user-friendly interface and advanced features for tracking performance, analyzing data, and optimizing digital strategies. Leverage the speed and scalability of Vercel to access detailed analytics in a secure and responsive environment, making it easy to monitor and improve your website’s performance`,
  keywords: [
    "GA4 dashboard",
    "Next.js dashboard",
    "Vercel deployment",
    "Real-time analytics",
    "Website performance dashboard",
    "User behavior tracking",
    "Traffic analysis dashboard",
    "Digital strategy insights",
    "Website performance metrics",
    "Next.js web app",
    "Vercel analytics",
    "Google Analytics 4",
    "Real-time data insights",
    "Next.js performance tracking",
    "Website analytics solution"
  ],
  authors: [{ name: 'Justin Abercrombia', url: 'http://www.github.com/jabercrombia' }],
  creator: 'Justin Abercrombia',
  openGraph: {
    images: '/homepage.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
