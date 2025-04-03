import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './Header';
import './index.css';
import { WalletConnector } from "./components/WalletConnector";
import { Deposit } from './components/Deposit';
import { Withdraw } from './components/Withdraw';
import { ClaimAirdrop } from './components/ClaimAirdrop';

export function App() {
    return (
        <TonConnectUIProvider manifestUrl="https://liquidtoken.vercel.app/manifest.json">
            <Router>
                <div className="app-container">
                    <Header />
                    <main className="landing">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <section className="hero">
                                        <h1 className="hero-title">Unlock the Future of Crypto</h1>
                                        <p className="hero-subtitle">
                                            You buy the top 10 cryptocurrencies at once when you mint new tokens
                                            <p>mint, withdraw, transfer and claim airdrops with seamless TON integration.</p>
                                        </p>
                                    </section>
                                }
                            />
                            <Route path="/connect-wallet" element={<WalletConnector />} />
                            <Route path="/deposit" element={<Deposit />} />
                            <Route path="/withdraw" element={<Withdraw />} />
                            <Route path="/claim-airdrop" element={<ClaimAirdrop />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </TonConnectUIProvider>
    );
}

export default App;