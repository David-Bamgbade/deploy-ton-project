// import { TonConnectUIProvider } from '@tonconnect/ui-react';
// import { Header } from './Header';
// import './index.css';
// import {TokenInteraction} from "./components/TokenInteraction.tsx";
//
// export function App() {
//     return (
//         <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/David-Bamgbade/mY-tOn-FroNtend/master/public/tonconnect-manifest.json">
//             <div className="app-container">
//                 <Header />
//                 <main>
//                     <TokenInteraction />
//                 </main>
//             </div>
//         </TonConnectUIProvider>
//     );
// }
//
// export default App;

// src/App.tsx
// import { TonConnectUIProvider } from '@tonconnect/ui-react';
// import { Header } from './Header';
//
// export function App() {
//     return (
//         <TonConnectUIProvider manifestUrl="https://<YOUR_APP_URL>/tonconnect-manifest.json">
//             <Header />
//             {/* Add other components later */}
//         </TonConnectUIProvider>
//     );
// }
//
// export default App;

// import { TonConnectUIProvider } from '@tonconnect/ui-react';
// import { Header } from './Header';
//
// export function App() {
//     return (
//         <TonConnectUIProvider manifestUrl="https://<YOUR_APP_URL>/tonconnect-manifest.json">
//             <Header />
//             {/* Add other components later */}
//         </TonConnectUIProvider>
//     );
// }
//
// export default App;

// src/App.tsx
// src/App.tsx
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Header } from './Header';
import './index.css';

export function App() {
    return (
        <TonConnectUIProvider manifestUrl="https://<YOUR_APP_URL>/tonconnect-manifest.json">
            <div className="app-container">
                <Header />
                <main className="landing">
                    <section className="hero">
                        <h1 className="hero-title">Unlock the Future of Crypto</h1>
                        <p className="hero-subtitle">
                            Deposit, withdraw, and claim airdrops with seamless TON integration.
                        </p>
                        <button className="hero-cta">Get Started</button>
                    </section>
                </main>
            </div>
        </TonConnectUIProvider>
    );
}

export default App;