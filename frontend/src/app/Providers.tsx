/**
 * App Providers (Theme, etc.)
 */

import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return (
    <div data-theme="light" className="min-h-screen">
      {children}
    </div>
  );
}

export default Providers;

