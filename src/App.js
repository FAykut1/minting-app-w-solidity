import { useEffect, useState } from 'react';
import './App.css';
import MintPage from './components/MintPage';
import NFTPage from './components/NFTPage';

import { Container, Nav, Navbar } from 'react-bootstrap';
import { hideAccountId } from './utils/util';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [page, setPage] = useState(1);

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
      <main className="w-full h-full">
        <Navbar bg="light" variant="light">
          <Container>
            <Navbar.Brand href="/">Best NFT Minting App</Navbar.Brand>

            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav className="me-auto">
                <Nav.Link onClick={() => setPage(0)}>Owned NFTs</Nav.Link>
                <Nav.Link onClick={() => setPage(1)}>Mint</Nav.Link>
              </Nav>
              {accounts.length <= 0 ? (
                <Nav>
                  <Nav.Link
                    className="text-red-800 text-xl font-bold"
                    onClick={connectAccounts}
                  >
                    Sign in
                  </Nav.Link>
                </Nav>
              ) : (
                <Navbar.Text>{hideAccountId(accounts[0])}</Navbar.Text>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div className="w-3/4 m-auto p-4">
          {accounts.length <= 0 ? (
            <span className="font-bold text-3xl text-center text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              You have to connect your account first, top right corner on the
              screen
            </span>
          ) : (
            showPage()
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
