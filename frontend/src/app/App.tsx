/**
 * Main App Component
 */

import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Router from './Router';
import Providers from './Providers';
import { useAuthStore } from '../stores/useAuthStore';
import ErrorBoundary from './ErrorBoundary';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Initialize auth state listener
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Providers>
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
      </Providers>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;

