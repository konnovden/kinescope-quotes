import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kinescope Quotes',
  description: 'Сметы для онлайн-трансляций',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
