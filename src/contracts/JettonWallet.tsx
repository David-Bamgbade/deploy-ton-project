
import {
    Address,
    Cell,
    Contract,
    ContractProvider,
    Sender,
    beginCell,
    contractAddress
} from '@ton/ton';

// Struct that matches the contract's state
export interface JettonWalletData {
    balance: bigint;
    owner: Address;
    master: Address;
    walletCode: Cell;
}

export class JettonDefaultWallet implements Contract {
    readonly address: Address;

    // Create JettonWallet instance from owner and master addresses
    static createFromAddress(masterAddress: Address, ownerAddress: Address): JettonDefaultWallet {
        // Get wallet code from master contract (in production, you'd load this from storage)
        const walletCode = Cell.fromBoc(Buffer.from('B5EE9C7241021101000327000114FF00F4A413F4BCF2C80B0102016202030202CC0405001BA0F605DA89A1F401F481F481A8610201D40607020120080900C30831C02497C138007434C0C05C6C2544D7C0FC03383E903E900C7E800B0E2FFC4D677118001C001E5B589738046AF2F47021F90558C705F2E19130E30364C5087C3E0ED44D0945A71D7522C00D6303A4E8208B35939AB33F5CB0020120ABCD021196D4FC03980715DE8BD4', 'hex'))[0];

        // Create data cell for jetton wallet
        const data = beginCell()
            .storeCoins(0) // Initial balance
            .storeAddress(ownerAddress) // Owner address
            .storeAddress(masterAddress) // Master address
            .storeRef(walletCode) // Wallet code
            .endCell();

        // Calculate contract address
        const addr = contractAddress(0, { // Workchain 0
            code: walletCode,
            data: data
        });

        return new JettonDefaultWallet(addr);
    }

    constructor(address: Address) {
        this.address = address;
    }

    // Get wallet data from contract
    async getWalletData(provider: ContractProvider): Promise<JettonWalletData> {
        const { stack } = await provider.get('get_wallet_data', []);

        return {
            balance: stack.readBigNumber(),
            owner: stack.readAddress(),
            master: stack.readAddress(),
            walletCode: stack.readCell()
        };
    }

    // Transfer tokens
    async sendTransfer(
        provider: ContractProvider,
        via: Sender,
        opts: {
            amount: bigint,
            destination: Address,
            responseDestination: Address,
            forwardTonAmount: bigint,
            forwardPayload?: Cell
        }
    ) {
        const messageBody = beginCell()
            .storeUint(0xf8a7ea5, 32) // TokenTransfer opcode
            .storeUint(0, 64) // queryId
            .storeCoins(opts.amount) // Amount to transfer
            .storeAddress(opts.destination) // Destination address
            .storeAddress(opts.responseDestination) // Response destination
            .storeMaybeRef(null) // Custom payload (none)
            .storeCoins(opts.forwardTonAmount) // Forward TON amount
            .storeSlice(opts.forwardPayload ? opts.forwardPayload.beginParse() : beginCell().endCell().beginParse()) // Forward payload
            .endCell();

        await provider.internal(via, {
            value: "0.05", // Send 0.05 TON for gas
            bounce: true,
            body: messageBody
        });
    }

    // Burn tokens
    async sendBurn(
        provider: ContractProvider,
        via: Sender,
        opts: {
            amount: bigint,
            responseDestination: Address
        }
    ) {
        const messageBody = beginCell()
            .storeUint(0x595f07bc, 32) // TokenBurn opcode
            .storeUint(0, 64) // queryId
            .storeCoins(opts.amount) // Amount to burn
            .storeAddress(via.address) // Owner address
            .storeAddress(opts.responseDestination) // Response destination
            .endCell();

        await provider.internal(via, {
            value: "0.05", // Send 0.05 TON for gas
            bounce: true,
            body: messageBody
        });
    }
}