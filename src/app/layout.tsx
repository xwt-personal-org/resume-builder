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
  title: "Resume Builder - AI 驱动的智能简历构建器",
  description: "创建针对特定岗位的专业简历，支持 AI 辅助生成、多模板切换、PDF/SVG 导出。数据完全在本地处理，保护您的隐私。",
  keywords: ["简历", "简历生成器", "Resume Builder", "AI 简历", "PDF 导出", "求职"],
  openGraph: {
    title: "Resume Builder - 智能简历构建器",
    description: "高效、专业的本地简历生成工具",
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