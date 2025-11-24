import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Header } from '@components/common/Header';
import { FlickeringGrid } from '@components/common/FlickeringGrid';
import { HomePage } from '@pages/HomePage';
import { ZtarknetConnectorProvider } from '@context/ZtarknetConnector';

function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse route and determine content
  let content;
  if (route === '#/' || route === '') {
    content = <HomePage />;
  } else {
    // Future pages can be added here
    content = <HomePage />;
  }

  return (
    <ZtarknetConnectorProvider>
      <FlickeringGrid
        className="fixed top-0 left-0 w-full h-screen z-[-2] pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, white 0%, white 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, white 0%, white 50%, transparent 100%)',
        }}
        squareSize={4}
        gridGap={6}
        color="#ff6b1a"
        maxOpacity={0.2}
        flickerChance={0.1}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        {content}
      </div>
    </ZtarknetConnectorProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
