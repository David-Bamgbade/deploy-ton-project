import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Header } from './Header';
import './index.css';
import {WalletConnector} from "./components/WalletConnector.tsx";

export function App() {


    return (
        <TonConnectUIProvider manifestUrl="https://final-tact-frontend-c2pcm3q9k-david-bamgbades-projects.vercel.app/manifest.json">
            <div className="app-container">
                <Header />
                <main className="landing">
                    <section className="hero">
                        <h1 className="hero-title">Unlock the Future of Crypto</h1>
                        <p className="hero-subtitle"></p>
                            You buy the top 10 cryptocurrencies at once when you mint new tokens
                            <p>
                                mint, withdraw, transfer and claim airdrops with seamless TON integration.
                            </p>

                        <WalletConnector/>
                    </section>
                </main>
            </div>
        </TonConnectUIProvider>
    );
}

export default App;