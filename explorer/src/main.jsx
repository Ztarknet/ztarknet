import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { MainPage } from '@pages/MainPage';
import { BlockPage } from '@pages/BlockPage';
import { TransactionPage } from '@pages/TransactionPage';

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
  if (route.startsWith('#/block/')) {
    const blockId = route.replace('#/block/', '');
    return <BlockPage blockId={blockId} />;
  }

  if (route.startsWith('#/tx/')) {
    const txid = route.replace('#/tx/', '');
    return <TransactionPage txid={txid} />;
  }

  return <MainPage />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
