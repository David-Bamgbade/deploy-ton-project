// import React, { useState, useEffect } from 'react';
// import { useTonConnectUI } from '@tonconnect/ui-react';
// import { Address, TonClient, beginCell } from '@ton/ton';
// import {JettonDefaultWallet} from "../contracts/JettonDefaultWallet.tsx";
//
// export const WalletConnector: React.FC = () => {
//     const [tonConnectUI] = useTonConnectUI();
//     const [client, setClient] = useState<TonClient | null>(null);
//     const [userWalletAddress, setUserWalletAddress] = useState<Address | null>(null);
//
//     const masterAddress = Address.parse('EQC66UZBdWHvgsqe94LRt8cgq-6LL6CQ0IbvQaiElfw2B-A5');
//
//
//     useEffect(() => {
//         const initClient = async () => {
//             try {
//                 const tonClient = new TonClient({
//                     endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
//                 });
//                 setClient(tonClient);
//             } catch (error) {
//                 console.error('Failed to initialize TON Client:', error);
//             }
//         };
//         initClient();
//     }, []);
//
//     const createUserWallet = async () => {
//         if (!client || !tonConnectUI.connected) {
//             console.error('TON Client or wallet not ready');
//             return;
//         }
//         try {
//             const ownerAddress = Address.parse(tonConnectUI.account!.address);
//             const jettonWallet = JettonDefaultWallet.createFromAddress(masterAddress, ownerAddress);
//             setUserWalletAddress(jettonWallet.address);
//             console.log('Jetton wallet address computed:', jettonWallet.address.toString());
//         } catch (error) {
//             console.error('Failed to compute Jetton wallet address:', error);
//         }
//     };
//
//     const transferTokens = async () => {
//         if (!client || !userWalletAddress || !tonConnectUI.connected) {
//             console.error('TON Client, wallet, or Jetton address not ready');
//             return;
//         }
//         try {
//             const message = beginCell()
//                 .storeUint(0xf8a7ea5, 32)
//                 .storeUint(0, 64)
//                 .storeCoins(1000000)
//                 .storeAddress(Address.parse('EQ_RECIPIENT_ADDRESS'))
//                 .storeAddress(Address.parse(tonConnectUI.account!.address))
//                 .storeCoins(0)
//                 .storeSlice(beginCell().endCell().beginParse())
//                 .endCell();
//
//             await tonConnectUI.sendTransaction({
//                 validUntil: Math.floor(Date.now() / 1000) + 60,
//                 messages: [
//                     {
//                         address: userWalletAddress.toString(),
//                         amount: '200000000',
//                         payload: message.toBoc().toString('base64'),
//                     },
//                 ],
//             });
//             console.log('Tokens transferred successfully');
//         } catch (error) {
//             console.error('Token transfer failed:', error);
//         }
//     };
//
//     const getBalance = async () => {
//         if (!client || !userWalletAddress) {
//             console.error('TON Client or Jetton address not ready');
//             return;
//         }
//         try {
//             const wallet = new JettonDefaultWallet(userWalletAddress);
//             const data = await wallet.getWalletData(client.provider(userWalletAddress));
//             const balance = data.balance;
//             console.log('Jetton Balance:', balance.toString());
//             return balance;
//         } catch (error) {
//             console.error('Failed to get balance:', error);
//         }
//     };
//
//     return (
//         <div className="wallet-connector">
//             {tonConnectUI.connected ? (
//                 <div>
//                     <p>Connected: {tonConnectUI.account?.address}</p>
//                     {!userWalletAddress ? (
//                         <button
//                             onClick={createUserWallet}
//                             style={{
//                                 padding: '10px 20px',
//                                 backgroundColor: '#28a745',
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: '20px',
//                                 cursor: 'pointer',
//                                 margin: '5px',
//                             }}
//                         >
//                             Create My Jetton Wallet
//                         </button>
//                     ) : (
//                         <>
//                             <p>My Jetton Wallet: {userWalletAddress.toString()}</p>
//                             <button
//                                 onClick={transferTokens}
//                                 style={{
//                                     padding: '10px 20px',
//                                     backgroundColor: '#007bff',
//                                     color: 'white',
//                                     border: 'none',
//                                     borderRadius: '20px',
//                                     cursor: 'pointer',
//                                     margin: '5px',
//                                 }}
//                             >
//                                 Transfer Tokens
//                             </button>
//                             <button
//                                 onClick={getBalance}
//                                 style={{
//                                     padding: '10px 20px',
//                                     backgroundColor: '#17a2b8',
//                                     color: 'white',
//                                     border: 'none',
//                                     borderRadius: '20px',
//                                     cursor: 'pointer',
//                                     margin: '5px',
//                                 }}
//                             >
//                                 Check Balance
//                             </button>
//                         </>
//                     )}
//                     <button
//                         onClick={() => tonConnectUI.disconnect()}
//                         style={{
//                             padding: '10px 20px',
//                             backgroundColor: '#dc3545',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '20px',
//                             cursor: 'pointer',
//                             margin: '5px',
//                         }}
//                     >
//                         Disconnect
//                     </button>
//                 </div>
//             ) : (
//                 <button
//                     onClick={() => tonConnectUI.connectWallet()}
//                     style={{
//                         padding: '10px 20px',
//                         backgroundColor: '#007bff',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '20px',
//                         cursor: 'pointer',
//                         fontSize: '16px',
//                         transition: 'background-color 0.3s',
//                     }}
//                     onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
//                     onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
//                 >
//                     Connect Wallet
//                 </button>
//             )}
//
//
//
//         </div>
//     );
// };

export const WalletConnector = () => {
    return (
        <div className="wallet-connector">
            <h2>Connect Your TON Wallet</h2>
            <p>Please use the button in the top-right corner to connect</p>
        </div>
    );
};
