/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from "next"
import "./globals.css"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
		<html lang='en'>
			<head>
				<script
					src='https://kit.fontawesome.com/aa78d92dd7.js'
					crossOrigin='anonymous'
				></script>
			</head>
			<body className={cn('bg-background min-h-screen antialiased')}>
				{children}
			</body>
		</html>
  );
}
