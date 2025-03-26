// // import { useTonWallet } from '@tonconnect/ui-react';
// // import { TonConnectButton } from '@tonconnect/ui-react';
// // import './index.css';
// //
// // export const Header = () => {
// //     const wallet = useTonWallet();
// //
// //     const handleDeposit = () => {
// //         if (!wallet) return alert('Please connect your wallet first!');
// //         alert('Deposit coming soon!');
// //     };
// //
// //     const handleWithdraw = () => {
// //         if (!wallet) return alert('Please connect your wallet first!');
// //         alert('Withdraw coming soon!');
// //     };
// //
// //     const handleClaimAirdrop = () => {
// //         if (!wallet) return alert('Please connect your wallet first!');
// //         alert('Airdrop claim coming soon!');
// //     };
// //
// //     return (
// //         <header className="header">
// //             <div className="logo">CryptoHub</div>
// //             <nav className="nav">
// //                 <button
// //                     onClick={handleDeposit}
// //                     disabled={!wallet}
// //                     className={`nav-button ${!wallet ? 'disabled' : ''}`}
// //                 >
// //                     Deposit
// //                 </button>
// //                 <button
// //                     onClick={handleWithdraw}
// //                     disabled={!wallet}
// //                     className={`nav-button ${!wallet ? 'disabled' : ''}`}
// //                 >
// //                     Withdraw
// //                 </button>
// //                 <button
// //                     onClick={handleClaimAirdrop}
// //                     disabled={!wallet}
// //                     className={`nav-button claim ${!wallet ? 'disabled' : ''}`}
// //                 >
// //                     Claim Airdrop
// //                 </button>
// //             </nav>
// //             <div className="wallet">
// //                 <TonConnectButton />
// //             </div>
// //         </header>
// //     );
// // };
//
// // src/Header.tsx
// import { useTonWallet } from '@tonconnect/ui-react';
// import { TonConnectButton } from '@tonconnect/ui-react';
// import './Header.css'; // Import the CSS file
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
//             <div className="logo">CryptoHub</div>
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

// src/Header.tsx
import { useTonWallet } from '@tonconnect/ui-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import './index.css'; // Import site-wide CSS (could be moved to App.tsx)

export const Header = () => {
    const wallet = useTonWallet();

    const handleDeposit = () => {
        if (!wallet) return alert('Please connect your wallet first!');
        alert('Deposit coming soon!');
    };

    const handleWithdraw = () => {
        if (!wallet) return alert('Please connect your wallet first!');
        alert('Withdraw coming soon!');
    };

    const handleClaimAirdrop = () => {
        if (!wallet) return alert('Please connect your wallet first!');
        alert('Airdrop claim coming soon!');
    };

    return (
        <header className="header">
            <div className="logo">CryptoHub</div>
            <nav className="nav">
                <button
                    onClick={handleDeposit}
                    disabled={!wallet}
                    className={`nav-button ${!wallet ? 'disabled' : ''}`}
                >
                    Deposit
                </button>
                <button
                    onClick={handleWithdraw}
                    disabled={!wallet}
                    className={`nav-button ${!wallet ? 'disabled' : ''}`}
                >
                    Withdraw
                </button>
                <button
                    onClick={handleClaimAirdrop}
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