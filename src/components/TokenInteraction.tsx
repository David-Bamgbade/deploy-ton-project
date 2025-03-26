import { useState, useEffect } from 'react';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Address, beginCell, toNano, TonClient, fromNano } from '@ton/ton';
import { JettonDefaultWallet } from '../contracts/JettonWallet';

export function TokenInteraction() {
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const [balance, setBalance] = useState<string | null>(null);
    const [jettonWalletAddress, setJettonWalletAddress] = useState<string | null>(null);
    const [recipient, setRecipient] = useState<string>('');
    const [transferAmount, setTransferAmount] = useState<string>('10');
    const [mintAmount, setMintAmount] = useState<string>('100');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
        apiKey: process.env.REACT_APP_TONCENTER_API_KEY || '',
    });

    const JETTON_MASTER_ADDRESS = Address.parse('EQCgZpf21ahzYpQRILH_cT6vCjJIfHTpQFDxMyqa9BaSFh2L');

    const calculateJettonWalletAddress = (ownerAddress: Address): Address => {
        if (!wallet) throw new Error('Wallet not connected');
        const jettonWallet = JettonDefaultWallet.createFromAddress(JETTON_MASTER_ADDRESS, ownerAddress);
        return jettonWallet.address;
    };

    const getJettonWalletAndBalance = async () => {
        if (!wallet || !wallet.account?.address) return;
        setIsLoading(true);

        try {
            const userAddress = Address.parse(wallet.account.address);
            const jettonWalletAddr = calculateJettonWalletAddress(userAddress);
            setJettonWalletAddress(jettonWalletAddr.toString());

            const jettonWallet = new JettonDefaultWallet(jettonWalletAddr);
            const walletData = await client.open(jettonWallet).getWalletData();
            setBalance(fromNano(walletData.balance));
        } catch (e) {
            console.error('Failed to fetch balance:', e);
            setBalance('0');
        } finally {
            setIsLoading(false);
        }
    };

    const mintTokens = async () => {
        if (!wallet) {
            alert('Please connect your wallet first!');
            return;
        }

        const amountToMint = Number(mintAmount);
        if (isNaN(amountToMint) || amountToMint <= 0) {
            alert('Please enter a valid mint amount greater than 0');
            return;
        }

        setIsLoading(true);

        try {
            const mintAmountNano = toNano(mintAmount);

            const mintMessage = beginCell()
                .storeUint(0, 32)
                .storeUint(0, 64)
                .storeAddress(Address.parse(wallet.account.address))
                .storeCoins(mintAmountNano)
                .endCell();

            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 300,
                messages: [
                    {
                        address: JETTON_MASTER_ADDRESS.toString(),
                        amount: toNano('0.05').toString(),
                        payload: mintMessage.toBoc().toString('base64'),
                    },
                ],
            };

            await tonConnectUI.sendTransaction(transaction);
            alert(`Minting request for ${mintAmount} NSWT sent! Wait for confirmation.`);
            setTimeout(getJettonWalletAndBalance, 10000);
        } catch (e) {
            console.error('Minting failed:', e);
            alert('Minting failed! Are you the owner?');
        } finally {
            setIsLoading(false);
        }
    };

    const transferTokens = async () => {
        if (!wallet || !jettonWalletAddress) {
            alert('Please connect your wallet and fetch balance first!');
            return;
        }

        if (!recipient.startsWith('EQ') || recipient.length !== 48) {
            alert('Please enter a valid TON address starting with EQ');
            return;
        }

        setIsLoading(true);

        try {
            const recipientAddress = Address.parse(recipient);
            const amount = toNano(transferAmount);

            const transferMessage = beginCell()
                .storeUint(0xf8a7ea5, 32)
                .storeUint(0, 64)
                .storeCoins(amount)
                .storeAddress(recipientAddress)
                .storeAddress(Address.parse(wallet.account.address))
                .storeMaybeRef(null)
                .storeCoins(toNano('0.01'))
                .storeSlice(beginCell().endCell().beginParse())
                .endCell();

            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 300,
                messages: [
                    {
                        address: jettonWalletAddress,
                        amount: toNano('0.05').toString(),
                        payload: transferMessage.toBoc().toString('base64'),
                    },
                ],
            };

            await tonConnectUI.sendTransaction(transaction);
            alert('Transfer request sent! Wait for confirmation.');
            setTimeout(getJettonWalletAndBalance, 10000);
        } catch (e) {
            console.error('Transfer failed:', e);
            alert('Transfer failed: ' + (e instanceof Error ? e.message : String(e)));
        } finally {
            setIsLoading(false);
        }
    };

    const burnTokens = async () => {
        if (!wallet || !jettonWalletAddress) {
            alert('Please connect your wallet and fetch balance first!');
            return;
        }

        setIsLoading(true);

        try {
            const burnAmount = toNano('10');

            const burnMessage = beginCell()
                .storeUint(0x595f07bc, 32)
                .storeUint(0, 64)
                .storeCoins(burnAmount)
                .storeAddress(Address.parse(wallet.account.address))
                .storeAddress(Address.parse(wallet.account.address))
                .endCell();

            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 300,
                messages: [
                    {
                        address: jettonWalletAddress,
                        amount: toNano('0.05').toString(),
                        payload: burnMessage.toBoc().toString('base64'),
                    },
                ],
            };

            await tonConnectUI.sendTransaction(transaction);
            alert('Burn request sent! Wait for confirmation.');
            setTimeout(getJettonWalletAndBalance, 10000);
        } catch (e) {
            console.error('Burn failed:', e);
            alert('Burn failed: ' + (e instanceof Error ? e.message : String(e)));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (wallet) {
            getJettonWalletAndBalance();
        }
    }, [wallet]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-6 max-w-lg w-full bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4 text-center">NSWT Token Interaction</h1>

                {!wallet ? (
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                        onClick={() => tonConnectUI.openModal()}
                    >
                        Connect Wallet
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-gray-50">
                            <p>
                                <span className="font-semibold">Connected Wallet:</span>{' '}
                                {wallet.account.address.slice(0, 6)}...{wallet.account.address.slice(-6)}
                            </p>
                            <p>
                                <span className="font-semibold">Jetton Wallet:</span>{' '}
                                {jettonWalletAddress
                                    ? `${jettonWalletAddress.slice(0, 6)}...${jettonWalletAddress.slice(-6)}`
                                    : 'Loading...'}
                            </p>
                            <p>
                                <span className="font-semibold">Balance:</span>{' '}
                                {balance !== null ? `${balance} NSWT` : 'Loading...'}
                            </p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-2">Mint Tokens</h2>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mint Amount</label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="100"
                                            value={mintAmount}
                                            onChange={(e) => setMintAmount(e.target.value)}
                                            min="1"
                                        />
                                        <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md text-gray-500">
                                            NSWT
                                        </span>
                                    </div>
                                </div>
                                <button
                                    className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={mintTokens}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Processing...' : 'Mint Tokens'}
                                </button>
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex-1"
                                onClick={getJettonWalletAndBalance}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Refresh Balance'}
                            </button>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-2">Transfer Tokens</h2>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Recipient Address</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="EQ..."
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="10"
                                            value={transferAmount}
                                            onChange={(e) => setTransferAmount(e.target.value)}
                                            min="1"
                                        />
                                        <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md text-gray-500">
                                            NSWT
                                        </span>
                                    </div>
                                </div>
                                <button
                                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={transferTokens}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Processing...' : 'Transfer Tokens'}
                                </button>
                            </div>
                        </div>

                        <button
                            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={burnTokens}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Burn 10 NSWT'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

