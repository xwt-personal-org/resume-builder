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
  title: "Resume Builder - AI 校招简历工作台",
  description: "AI 驱动的校招简历构建器，支持内容编辑、布局控制、Gemini 辅助生成以及 PDF/SVG/JSON 导出。",
  keywords: ["简历", "简历生成器", "Resume Builder", "AI 简历", "PDF 导出", "求职", "Gemini AI"],
  openGraph: {
    title: "Resume Builder - AI 校招简历工作台",
    description: "用于校招简历编辑、预览、AI 优化与导出的本地工作台。",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
