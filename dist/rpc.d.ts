import { IHTTPClient } from "./http";
import { ICurrentStats, IEosAbi, IEosAccount, IEosBlockInfo, IEosChainInfo, IEosProds, IEosProdsTable, IEosTrx } from "./type";
export declare class EOSClient {
    client: IHTTPClient;
    constructor(client?: IHTTPClient);
    /**
     * Returns an object containing various details about the blockchain.
     */
    getInfo(): Promise<import("./http").IMessage<IEosChainInfo>>;
    /**
     * Returns an object containing various details about a specific block on the blockchain.
     * @param id Provide a block number or a block id
     */
    getBlock(id: string | number): Promise<import("./http").IMessage<IEosBlockInfo>>;
    /**
     * Returns an object containing various details about a specific account on the blockchain.
     */
    getAccountInfo(account: string): Promise<import("./http").IMessage<IEosAccount>>;
    /**
     * Call account list under public key provided
     * ref to `get_key_accounts`
     * @see https://developers.eos.io/eosio-nodeos/reference#get_key_accounts-1
     */
    getKeyAccount(pubKey: string): Promise<import("./http").IMessage<{
        accounts_name: string[];
    }>>;
    getCurrentStats(code: string, symbol: string): Promise<import("./http").IMessage<ICurrentStats>>;
    /**
     * Call ABI of providing account name
     * @param account
     */
    getABI(account: string): Promise<import("./http").IMessage<{
        account_name: string;
        abi: IEosAbi;
    }>>;
    getCode(account: string): Promise<import("./http").IMessage<{
        account_name: string;
        code_hash: string;
        wast: string;
        wasm: string;
        abi: IEosAbi;
    }>>;
    getRawCodeAndABI(account: string): Promise<import("./http").IMessage<{
        account_name: string;
        wasm: string;
        abi: string;
    }>>;
    /**
     * Returns an object containing rows from the specified table.
     */
    getTableRows<T = any>(data: {
        scope: string | number;
        code: string | number;
        table: string;
        json: boolean;
        table_key?: string;
        lower_bound?: string | number;
        upper_bound?: string | number;
        limit?: number;
        key_type?: string | number;
        index_position?: number;
        encode_type?: "dec" | "hex";
    }): Promise<import("./http").IMessage<{
        rows: T[];
        more: boolean;
    }>>;
    getTableByScope<T = any>(data: {
        code: string;
        table: string;
        lower_bound?: string | number;
        upper_bound?: string | number;
        limit?: number;
    }): Promise<import("./http").IMessage<{
        rows: T[];
        more: boolean;
    }>>;
    /**
     * Call block header state
     * @param id Provide a block number or a block id
     */
    getBlockHeaderState(id: string): Promise<import("./http").IMessage<any>>;
    /**
     * Call Balance of your account with token symbol
     * @param code token account name
     * @param account your account name
     * @param symbol option token symbol
     * @returns string e.g. `1.0001 EOS`
     */
    getBalance(code: string, account: string, symbol?: string): Promise<import("./http").IMessage<string[]>>;
    /**
     * This method expects a transaction in JSON format and will attempt to apply it to the blockchain.
     * @param signatures signatures array of signatures required to authorize transaction
     * @param compression compression used, usually false
     * @param packedCtxFreeData packed_context_free_data: json of hex
     * @param packedTrx packed_trx: json of hex
     */
    pushTransaction(signatures: string[], compression: "true" | "false", packedCtxFreeData: string, packedTrx: string): Promise<import("./http").IMessage<{
        transaction_id: string;
    }>>;
    /**
     * Serializes json to binary hex.
     *
     * The resulting binary hex is usually used for the data field in push_transaction.
     * @param code Account name
     * @param action action name
     * @param args json args
     */
    abiJSONToBin(code: string, action: string, args: object): Promise<import("./http").IMessage<{
        binargs: string;
    }>>;
    /**
     * Serializes binary hex to json.
     * @param code Account name
     * @param action action name
     * @param binargs binary args
     */
    abiBinToJSON(code: string, action: string, binargs: string): Promise<import("./http").IMessage<{
        args: any;
    }>>;
    getTxInfo(id: number): Promise<import("./http").IMessage<IEosTrx>>;
    getControlledAccounts(account: string): Promise<import("./http").IMessage<{
        controlled_accounts: string[];
    }>>;
    getRAMPrice(): Promise<string>;
    /**
     * Call NET And CPU price
     *
     * Call these value should compute from a referer account,
     * so best suggestion is that gives a EOS exchange platform account
     */
    getNetAndCpuPrice(refAccount?: string): Promise<{
        cpuPrice: string;
        netPrice: string;
    }>;
    /**
     * Call producer list,available 1.4 or above,call `getProducerTable` if you run in lower version
     * @param limit count you wanna
     * @param lowBound a-z 1-5
     */
    getProducerList(limit: number, lowBound: string): Promise<import("./http").IMessage<IEosProds>>;
    /**
     * Call producer list,available 1.0 version or above
     * @param limit count you wanna
     * @param lowBound a-z 1-5
     * @param upperBound a-z 1-5
     * @example find producer list which name start with `a`.
     * getProducerTable({ lowBound: "a", upperBound: "b", limit: 1000 })
     */
    getProducerTable(lowBound: string, upperBound: string, limit?: number): Promise<import("./http").IMessage<{
        rows: IEosProdsTable[];
        more: boolean;
    }>>;
}
