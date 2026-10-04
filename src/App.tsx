import React, { useState, useEffect } from 'react';
import { HostArenaView } from './views/HostArenaView';
import { ControllerView } from './views/ControllerView';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('host');

  useEffect(() => {
    const evaluateRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.includes('/controller') || hash.includes('/controller') || hash.includes('controller')) {
        setCurrentRoute('controller');
      } else {
        // Default to host / arena
        setCurrentRoute('host');
      }
    };

    evaluateRoute();

    window.addEventListener('popstate', evaluateRoute);
    window.addEventListener('hashchange', evaluateRoute);

    return () => {
      window.removeEventListener('popstate', evaluateRoute);
      window.removeEventListener('hashchange', evaluateRoute);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-950 font-sans antialiased text-slate-100">
      {currentRoute === 'controller' ? (
        <ControllerView />
      ) : (
        <HostArenaView />
      )}
    </div>
  );
};

export default App;
