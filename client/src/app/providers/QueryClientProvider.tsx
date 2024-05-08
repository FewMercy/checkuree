'use client';

import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface ProvidersProps {
    children: React.ReactNode;
}

const QueryClientProviders = ({ children }: ProvidersProps) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                retry: 3,
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
};

export default QueryClientProviders;
