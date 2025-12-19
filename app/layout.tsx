import type React from "react"
import type { Metadata } from "next"
import { Mountains_of_Christmas } from "next/font/google"
import "./globals.css"

const mountainsOfChristmas = Mountains_of_Christmas({
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "Santa Nodemonkes Viewer",
  description: "Check out the Santa Nodemonkes collection with custom backgrounds!",
  keywords: ["Nodemonkes", "NFT", "Christmas", "Santa"],
  authors: [{ name: "Nodemonkes Community" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={mountainsOfChristmas.className}>{children}</body>
    </html>
  )
}
