// // src/Header.tsx
// import { useTonWallet } from '@tonconnect/ui-react';
// import { TonConnectButton } from '@tonconnect/ui-react';
// import './index.css'; // Import site-wide CSS (could be moved to App.tsx)
//
// export const Header = () => {
//     const wallet = useTonWallet();
//
//     const handleDeposit = () => {
//         if (!wallet) return alert('Please connect your wallet first!');
//         alert('Deposit coming soon!');
//     };
//
//     const handleWithdraw = () => {
//         if (!wallet) return alert('Please connect your wallet first!');
//         alert('Withdraw coming soon!');
//     };
//
//     const handleClaimAirdrop = () => {
//         if (!wallet) return alert('Please connect your wallet first!');
//         alert('Airdrop claim coming soon!');
//     };
//
//     return (
//         <header className="header">
//             <div className="logo">LiquidToken</div>
//             <nav className="nav">
//                 <button
//                     onClick={handleDeposit}
//                     disabled={!wallet}
//                     className={`nav-button ${!wallet ? 'disabled' : ''}`}
//                 >
//                     Deposit
//                 </button>
//                 <button
//                     onClick={handleWithdraw}
//                     disabled={!wallet}
//                     className={`nav-button ${!wallet ? 'disabled' : ''}`}
//                 >
//                     Withdraw
//                 </button>
//                 <button
//                     onClick={handleClaimAirdrop}
//                     disabled={!wallet}
//                     className={`nav-button claim ${!wallet ? 'disabled' : ''}`}
//                 >
//                     Claim Airdrop
//                 </button>
//             </nav>
//             <div className="wallet">
//                 <TonConnectButton />
//             </div>
//         </header>
//     );
// };

import { useTonWallet } from '@tonconnect/ui-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useNavigate } from 'react-router-dom';
import './index.css';

export const Header = () => {
    const wallet = useTonWallet();
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        if (!wallet) {
            alert('Please connect your wallet first!');
            return;
        }
        navigate(path);
    };

    return (
        <header className="header">
            <div className="logo">LiquidToken</div>
            <nav className="nav">
                <button
                    onClick={() => handleNavigation('/deposit')}
                    disabled={!wallet}
                    className={`nav-button ${!wallet ? 'disabled' : ''}`}
                >
                    Deposit
                </button>
                <button
                    onClick={() => handleNavigation('/withdraw')}
                    disabled={!wallet}
                    className={`nav-button ${!wallet ? 'disabled' : ''}`}
                >
                    Withdraw
                </button>
                <button
                    onClick={() => handleNavigation('/claim-airdrop')}
                    disabled={!wallet}
                    className={`nav-button claim ${!wallet ? 'disabled' : ''}`}
                >
                    Claim Airdrop
                </button>
            </nav>
            <div className="wallet">
                <TonConnectButton />
            </div>
        </header>
    );
};