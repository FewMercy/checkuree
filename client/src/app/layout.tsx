import './globals.css';
import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';

// Provider
import { CircularProgress, ThemeProvider } from '@mui/material';
import theme from '@/styles/theme';

import { RootToaster } from '@/providers/RootToaster';
import QueryClientProviders from '@/providers/QueryClientProvider';

const notoSans = Noto_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: '출석부 서비스',
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
                <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
                <link
                    rel="icon"
                    type="image/png"
                    href="/favicon/favicon-32x32.png"
                    sizes="32x32"
                />
                <link
                    rel="apple-touch-icon"
                    href="/favicon/apple-touch-icon.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
                <link
                    rel="mask-icon"
                    href="/favicon/safari-pinned-tab.svg"
                    color="#5bbad5"
                />
                <meta name="theme-color" content="#ffffff" />
                <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined&display=block"
                    rel="stylesheet"
                />
            </head>
            <body className={notoSans.className}>
                <QueryClientProviders>
                    <ThemeProvider theme={theme}>
                        <RootToaster />
                        <Suspense fallback={<CircularProgress />}>
                            {children}
                        </Suspense>
                    </ThemeProvider>
                </QueryClientProviders>
            </body>
        </html>
    );
}
