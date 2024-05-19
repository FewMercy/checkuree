import './globals.css';
import React from 'react';
import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';

// Provider
import { ThemeProvider } from '@mui/material';
import theme from '@/styles/theme';
import { NextAuthProvider } from './providers/NextAuthProvider';
import QueryClientProviders from './providers/QueryClientProvider';

const notoSans = Noto_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'CHECKUREE',
    description: '출석부 서비스',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <title>CHECKUREE</title>
                <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined&display=block"
                    rel="stylesheet"
                />
            </head>
            <body className={notoSans.className}>
                <QueryClientProviders>
                    <NextAuthProvider>
                        <ThemeProvider theme={theme}>{children}</ThemeProvider>
                    </NextAuthProvider>
                </QueryClientProviders>
            </body>
        </html>
    );
}
