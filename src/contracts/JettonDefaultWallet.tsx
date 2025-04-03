import {
    Address,
    Cell,
    Contract,
    ContractProvider,
    Sender,
    beginCell,
    contractAddress,
} from '@ton/ton';

export interface JettonWalletData {
    balance: bigint;
    owner: Address;
    master: Address;
    walletCode: Cell;
}

export class JettonDefaultWallet implements Contract {
    readonly address: Address;

    static createFromAddress(masterAddress: Address, ownerAddress: Address): JettonDefaultWallet {
        const walletCode = Cell.fromBoc(
            Buffer.from(
                'b5ee9c7241021601000486000114ff00f4a413f4bcf2c80b01020162021103dad0eda2edfb01d072d721d200d200fa4021103450666f04f86102f862ed44d0d200019afa40fa40d3ff55206c1399fa40fa405902d10170e204925f04e022d749c21fe30002f9012082f0c1c8ebe8e42f1458f2693e8bef345c9c08db8c56d2ca637be9b436ea1f68976fbae302030b0c04ea02d31f2182100f8a7ea5ba8f5531d33ffa00fa40fa40d2000191d4926d01e2fa00516616151443305f0334f8416f2410235f03268200905802c705f2f48200d5575372bef2f45161a15e3126db3c82100bebc2007f726d708b08106b105c104d103ae0218210178d4519bae302218210595f07bcba1304050600fec8556082100f8a7ea55008cb1f16cb3f5004fa0258cf1601cf16216eb3957f01ca00cc947032ca00e201fa0201cf16c95e4215146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0012c87f01ca0055205acf1658cf16cbffc9ed54db31008431d33ffa00fa40fa00514414433010355f05f8416f2410235f032281365302c705f2f48200eecf21c200f2f413a0c87f01ca0055205acf1658cf16cbffc9ed54db310278e302018210946a98b6ba8eaed33f0131c8018210aff90f5758cb1fcb3fc913f84201706ddb3cc87f01ca0055205acf1658cf16cbffc9ed54db31e002070a02fe31d33ffa00fa40fa40553010245f04f8416f2410235f032381542702c705f2f48200eecf21c200f2f48200d5575341bef2f45133a1821005f5e1007f727054107627c855308210595f07bc5005cb1f13cb3f01fa0201cf1601cf16c924045077146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb08a080900065bcf81013a8ae2f400c901fb0002c87f01ca0055205acf1658cf16cbffc9ed54db310f00a06d6d226eb3995b206ef2d0806f22019132e21024700304804250231036552212c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0000283002c87f01ca0055205acf1658cf16cbffc9ed54015482f016aa0c57d3dd87701c4839d8430a15f843690f967ae960fc67c5d3289d219431bae3025f03f2c0820d03f6f8416f2410235f035210f82ac87001ca005a59cf1601cf16c95c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d082100bebc2007f728855141036453304c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818ae2f400c901fb00020e0f100014000000004465706c6f79001a58cf8680cf8480f400f400cf810024c87f01ca0055205acf1658cf16cbffc9ed5402012012140149bdb5cf6a268690000cd7d207d2069ffaa903609ccfd207d202c816880b8712a816d9e3618c13007c5230f82ac87001ca005a59cf1601cf16c9705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d00145bcfa9f6a268690000cd7d207d2069ffaa903609ccfd207d202c816880b8716d9e3618c150002206460d7c7',
                'hex'
            )
        )[0];

        const data = beginCell()
            .storeCoins(0)
            .storeAddress(ownerAddress)
            .storeAddress(masterAddress)
            .storeRef(walletCode)
            .endCell();

        const addr = contractAddress(0, {
            code: walletCode,
            data: data,
        });

        return new JettonDefaultWallet(addr);
    }

    constructor(address: Address) {
        this.address = address;
    }

    async getWalletData(provider: ContractProvider): Promise<JettonWalletData> {
        try {
            const { stack } = await provider.get('get_wallet_data', []);
            return {
                balance: stack.readBigNumber(),
                owner: stack.readAddress(),
                master: stack.readAddress(),
                walletCode: stack.readCell(),
            };
        } catch (error) {
            throw new Error(`Failed to get wallet data: ${error}`);
        }
    }

    async sendTransfer(
        provider: ContractProvider,
        via: Sender,
        opts: {
            amount: bigint;
            destination: Address;
            responseDestination: Address;
            forwardTonAmount: bigint;
            forwardPayload?: Cell;
        }
    ) {
        const messageBody = beginCell()
            .storeUint(0xf8a7ea5, 32)
            .storeUint(0, 64)
            .storeCoins(opts.amount)
            .storeAddress(opts.destination)
            .storeAddress(opts.responseDestination)
            .storeMaybeRef(null)
            .storeCoins(opts.forwardTonAmount)
            .storeSlice(
                opts.forwardPayload ? opts.forwardPayload.beginParse() : beginCell().endCell().beginParse()
            )
            .endCell();

        await provider.internal(via, {
            value: '0.05',
            bounce: true,
            body: messageBody,
        });
    }

    async sendBurn(
        provider: ContractProvider,
        via: Sender,
        opts: {
            amount: bigint;
            responseDestination: Address;
        }
    ) {
        const messageBody = beginCell()
            .storeUint(0x595f07bc, 32)
            .storeUint(0, 64)
            .storeCoins(opts.amount)
            .storeAddress(via.address!)
            .storeAddress(opts.responseDestination)
            .endCell();

        await provider.internal(via, {
            value: '0.05',
            bounce: true,
            body: messageBody,
        });
    }
}