import React, { useState, useEffect } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address, TonClient, beginCell } from '@ton/ton';

export const WalletConnector: React.FC = () => {
    const [tonConnectUI] = useTonConnectUI();
    const [client, setClient] = useState<TonClient | null>(null);
    const [userWalletAddress, setUserWalletAddress] = useState<Address | null>(null);

    const masterAddress = Address.parse('EQC66UZBdWHvgsqe94LRt8cgq-6LL6CQ0IbvQaiElfw2B-A5'); // Your master contract address
    const initialWalletAddress = Address.parse('EQBbTd-tlYAYHpbeLTxrQ1V0xHRXr6BE30MK2c9erRUHWY8i'); // Your deployed wallet

    // Initialize TON Client
    useEffect(() => {
        const initClient = async () => {
            const tonClient = new TonClient({
                endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
            });
            setClient(tonClient);
        };
        initClient().then();
    }, []);

    // Create a new wallet for the user
    const createUserWallet = async () => {
        if (!client || !tonConnectUI.connected) return;

        const message = beginCell().storeStringTail('CreateWallet').endCell();
        await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 60,
            messages: [
                {
                    address: initialWalletAddress.toString(), // Send to your initial wallet to trigger creation
                    amount: '200000000', // 0.2 TON in nanotons
                    payload: message.toBoc().toString('base64'),
                },
            ],
        });

        // Calculate the new wallet address (deterministic based on sender)
        const newWalletInit = await client.runMethod(initialWalletAddress, 'getJettonWalletAddress', [
            { type: 'slice', cell: beginCell().storeAddress(Address.parse(tonConnectUI.account!.address)).endCell() },
        ]);
        const newWalletAddress = newWalletInit.stack.readAddress();
        setUserWalletAddress(newWalletAddress);
        console.log('New wallet created at:', newWalletAddress.toString());
    };

    // Transfer tokens
    const transferTokens = async () => {
        if (!client || !userWalletAddress) return;

        const message = beginCell()
            .storeUint(0xf8a7ea5, 32) // TokenTransfer opcode
            .storeUint(0, 64) // queryId
            .storeCoins(1000000) // Amount (e.g., 1 token, adjust decimals)
            .storeAddress(Address.parse('EQ_RECIPIENT_ADDRESS')) // Destination
            .storeAddress(Address.parse(tonConnectUI.account!.address)) // Response destination
            .storeCoins(0) // forwardTonAmount
            .storeSlice(beginCell().endCell().beginParse()) // forwardPayload
            .endCell();

        await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 60,
            messages: [
                {
                    address: userWalletAddress.toString(),
                    amount: '200000000', // 0.2 TON
                    payload: message.toBoc().toString('base64'),
                },
            ],
        });
        console.log('Tokens transferred');
    };

    // Mint tokens (only master can mint, so this is an example from master)
    const mintTokens = async () => {
        if (!client || !userWalletAddress) return;

        const message = beginCell()
            .storeUint(0x178d4519, 32) // TokenMint opcode
            .storeUint(0, 64) // queryId
            .storeCoins(1000000) // Amount (e.g., 1 token)
            .storeAddress(userWalletAddress) // Receiver
            .storeCoins(0) // forwardTonAmount
            .storeSlice(beginCell().endCell().beginParse()) // forwardPayload
            .endCell();

        await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 60,
            messages: [
                {
                    address: masterAddress.toString(), // Sent from master
                    amount: '200000000', // 0.2 TON
                    payload: message.toBoc().toString('base64'),
                },
            ],
        });
        console.log('Tokens minted');
    };

    // Get balance
    const getBalance = async () => {
        if (!client || !userWalletAddress) return;
        const result = await client.runMethod(userWalletAddress, 'getBalance');
        const balance = result.stack.readBigNumber();
        console.log('Balance:', balance.toString());
        return balance;
    };

    return (
        <div className="wallet-connector">
            {tonConnectUI.connected ? (
                <div>
                    <p>Connected: {tonConnectUI.account?.address}</p>
                    {!userWalletAddress ? (
                        <button onClick={createUserWallet}>Create My Wallet</button>
                    ) : (
                        <>
                            <p>My Wallet: {userWalletAddress.toString()}</p>
                            <button onClick={transferTokens}>Transfer Tokens</button>
                            <button onClick={mintTokens}>Mint Tokens</button>
                            <button onClick={getBalance}>Check Balance</button>
                        </>
                    )}
                    <button onClick={() => tonConnectUI.disconnect()}>Disconnect</button>
                </div>
            ) : (
                <button
                    onClick={() => tonConnectUI.connectWallet()}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px', // More rounded edges
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
                >
                    Connect Wallet
                </button>
            )}
        </div>
    );
};