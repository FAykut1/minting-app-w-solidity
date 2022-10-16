import { useEffect, useState } from 'react';
import './App.css';
import MintPage from './components/MintPage';
import NFTPage from './components/NFTPage';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getCurrentAccounts();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', accountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', accountsChanged);
      };
    }
  }, []);

  const connectAccounts = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccounts(accounts);
    }
  };

  const getCurrentAccounts = async () => {
    const addressArray = await window.ethereum.request({
      method: 'eth_accounts',
    });
    setAccounts(addressArray);
  };

  const accountsChanged = (accounts) => {
    setAccounts(accounts);
  };

  const showPage = () => {
    switch (page) {
      case 0:
        return <NFTPage />;
      case 1:
        return <MintPage />;
      default:
        return <NFTPage />;
    }
  };

  return (
    <div className="App">
      <main className="w-full h-full grid place-items-center">
        {accounts.length <= 0 ? (
          <button
            onClick={connectAccounts}
            className="text-white text-3xl bg-slate-700 hover:p-5 hover:bg-slate-600 p-6 rounded-3xl"
          >
            Connect to Metamask
          </button>
        ) : (
          <div className="">
            <div className="btns">
              <button onClick={() => setPage(0)}>Show minted NFTS</button>
              <button onClick={() => setPage(1)}>Mint</button>
            </div>
            {showPage()}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
