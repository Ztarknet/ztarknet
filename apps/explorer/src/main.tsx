import { Header } from '@components/common/Header';
import { AccountPage } from '@pages/AccountPage';
import { BlockPage } from '@pages/BlockPage';
import { MainPage } from '@pages/MainPage';
import { TransactionPage } from '@pages/TransactionPage';
import { VerifierPage } from '@pages/VerifierPage';
import { FlickeringGrid } from '@workspace/ui/components/flickering-grid';
import { type ReactElement, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [route, setRoute] = useState<string>(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse route
  let content: ReactElement;
  if (route.startsWith('#/block/')) {
    const blockId = route.replace('#/block/', '');
    content = <BlockPage blockId={blockId} />;
  } else if (route.startsWith('#/tx/')) {
    const txid = route.replace('#/tx/', '');
    content = <TransactionPage txid={txid} />;
  } else if (route.startsWith('#/verifier/')) {
    const verifierId = route.replace('#/verifier/', '');
    content = <VerifierPage verifierId={verifierId} />;
  } else if (route.startsWith('#/account/')) {
    const address = route.replace('#/account/', '');
    content = <AccountPage address={address} />;
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

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
