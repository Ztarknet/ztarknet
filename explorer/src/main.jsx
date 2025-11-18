import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Header } from '@components/common/Header';
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
  let content;
  if (route.startsWith('#/block/')) {
    const blockId = route.replace('#/block/', '');
    content = <BlockPage blockId={blockId} />;
  } else if (route.startsWith('#/tx/')) {
    const txid = route.replace('#/tx/', '');
    content = <TransactionPage txid={txid} />;
  } else {
    content = <MainPage />;
  }

  return (
    <>
      <Header />
      {content}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
