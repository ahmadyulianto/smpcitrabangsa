import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://smpcitrabangsa.sch.id"),
  title: "SMP Citra Bangsa Bondowoso | Trabas Enviropreneurschool",
  description: "Official website of SMP Citra Bangsa Bondowoso. A premium environmental and entrepreneurship based digital school in Curahdami, Bondowoso.",
  keywords: "smp citra bangsa, smp citra bangsa bondowoso, trabas bondowoso, enviropreneurschool, sekolah terbaik bondowoso, ppdb smp citra bangsa",
  openGraph: {
    title: "SMP Citra Bangsa Bondowoso | Trabas Enviropreneurschool",
    description: "A premium environmental and entrepreneurship based digital school in Curahdami, Bondowoso.",
    url: "https://smpcitrabangsa.sch.id",
    siteName: "SMP Citra Bangsa Bondowoso",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "SMP Citra Bangsa Bondowoso Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="font-body bg-slate-950 text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-slate-900 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
