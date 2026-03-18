import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tenderscope AI",
  description: "Plateforme d'analyse d'appels d'offres",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased text-slate-900 dark:text-slate-100 bg-background-light dark:bg-background-dark`}>
        {children}
      </body>
    </html>
  );
}
