import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Header } from '@components/common/Header';
import { FlickeringGrid } from '@components/common/FlickeringGrid';
import { MainPage } from '@pages/MainPage';
import { BlockPage } from '@pages/BlockPage';
import { TransactionPage } from '@pages/TransactionPage';
import { VerifierPage } from '@pages/VerifierPage';

function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse route
  let content;
  if (route.startsWith('#/block/')) {
    const blockId = route.replace('#/block/', '');
    content = <BlockPage blockId={blockId} />;
  } else if (route.startsWith('#/tx/')) {
    const txid = route.replace('#/tx/', '');
    content = <TransactionPage txid={txid} />;
  } else if (route.startsWith('#/verifier/')) {
    const verifierId = route.replace('#/verifier/', '');
    content = <VerifierPage verifierId={verifierId} />;
  } else {
    content = <MainPage />;
  }

  return (
    <>
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
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
