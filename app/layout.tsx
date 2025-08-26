import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MyApp Landing Page",
  description: "Landing page with login using Supabase",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">{children}</body>
    </html>
  )
}
