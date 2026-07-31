import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";

// 둥글둥글하고 친근한 구글 'Jua' 폰트 설정
const juaFont = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jua",
  display: "swap",
});

export const metadata: Metadata = {
  title: "다혜쌤의 수학교실 🎈 | 재미있는 유아·초등 수학",
  description: "파스텔 솜사탕 느낌의 아기자기한 다혜쌤의 수학교실 보일러플레이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={juaFont.variable}>
      <body className={`${juaFont.className} antialiased selection:bg-pink-200 selection:text-pink-900`}>
        {children}
      </body>
    </html>
  );
}
