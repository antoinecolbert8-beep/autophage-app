import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Autophage - The First AI that Grows Itself',
    description: 'Autonomous Ad Scaling SaaS',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}

