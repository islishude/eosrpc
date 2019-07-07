"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("./http");
class EOSClient {
    constructor(client) {
        this.client = client || new http_1.HttpClient("http://127.0.0.1:8080");
    }
    /**
     * Returns an object containing various details about the blockchain.
     */
    getInfo() {
        return this.client.call("/v1/chain/get_info");
    }
    /**
     * Returns an object containing various details about a specific block on the blockchain.
     * @param id Provide a block number or a block id
     */
    getBlock(id) {
        return this.client.call("/v1/chain/get_block", {
            block_num_or_id: id,
        });
    }
    /**
     * Returns an object containing various details about a specific account on the blockchain.
     */
    getAccountInfo(account) {
        return this.client.call("/v1/chain/get_account", {
            account_name: account,
        });
    }
    /**
     * Call account list under public key provided
     * ref to `get_key_accounts`
     * @see https://developers.eos.io/eosio-nodeos/reference#get_key_accounts-1
     */
    getKeyAccount(pubKey) {
        return this.client.call("/v1/history/get_key_accounts", {
            public_key: pubKey,
        });
    }
    getCurrentStats(code, symbol) {
        return this.client.call("/v1/chain/get_currency_stats", {
            code,
            symbol,
        });
    }
    /**
     * Call ABI of providing account name
     * @param account
     */
    getABI(account) {
        return this.client.call("/v1/chain/get_abi", {
            account_name: account,
        });
    }
    getCode(account) {
        return this.client.call("/v1/chain/get_code", {
            account_name: account,
            code_as_wasm: 1,
        });
    }
    getRawCodeAndABI(account) {
        return this.client.call("/v1/chain/get_raw_code_and_abi", {
            account_name: account,
        });
    }
    /**
     * Returns an object containing rows from the specified table.
     */
    getTableRows(data) {
        return this.client.call("/v1/chain/get_table_rows", data);
    }
    getTableByScope(data) {
        return this.client.call("/v1/chain/get_table_by_scope", data);
    }
    /**
     * Call block header state
     * @param id Provide a block number or a block id
     */
    getBlockHeaderState(id) {
        return this.client.call("/v1/chain/get_block_header_state", {
            block_num_or_id: id,
        });
    }
    /**
     * Call Balance of your account with token symbol
     * @param code token account name
     * @param account your account name
     * @param symbol option token symbol
     * @returns string e.g. `1.0001 EOS`
     */
    getBalance(code, account, symbol) {
        return this.client.call("/v1/chain/get_currency_balance", {
            account,
            code,
            symbol,
        });
    }
    /**
     * This method expects a transaction in JSON format and will attempt to apply it to the blockchain.
     * @param signatures signatures array of signatures required to authorize transaction
     * @param compression compression used, usually false
     * @param packedCtxFreeData packed_context_free_data: json of hex
     * @param packedTrx packed_trx: json of hex
     */
    pushTransaction(signatures, compression, packedCtxFreeData, packedTrx) {
        return this.client.call("/v1/chain/push_transaction", {
            compression,
            packed_context_free_data: packedCtxFreeData,
            packed_tx: packedTrx,
            signatures,
        });
    }
    /**
     * Serializes json to binary hex.
     *
     * The resulting binary hex is usually used for the data field in push_transaction.
     * @param code Account name
     * @param action action name
     * @param args json args
     */
    abiJSONToBin(code, action, args) {
        return this.client.call("/v1/chain/abi_json_to_bin", {
            action,
            args,
            code,
        });
    }
    /**
     * Serializes binary hex to json.
     * @param code Account name
     * @param action action name
     * @param binargs binary args
     */
    abiBinToJSON(code, action, binargs) {
        return this.client.call("/v1/chain/abi_json_to_bin", {
            action,
            binargs,
            code,
        });
    }
    getTxInfo(id) {
        return this.client.call("/v1/history/get_transaction", {
            id,
        });
    }
    getControlledAccounts(account) {
        return this.client.call("v1/history/get_controlled_accounts", {
            controlling_account: account,
        });
    }
    async getRAMPrice() {
        const { body: { rows }, } = await this.getTableRows({
            code: "eosio",
            json: true,
            scope: "eosio",
            table: "rammarket",
        });
        const { base, quote } = rows[0];
        // RAM PRICE = (n * quote.balance) / (n + base.balance / 1024)
        const quoteBalance = Number(quote.balance.split(/\s/)[0]);
        const baseBalance = 1 + Number(base.balance.split(/\s/)[0]);
        return (quoteBalance / (baseBalance / 1024)).toFixed(4);
    }
    /**
     * Call NET And CPU price
     *
     * Call these value should compute from a referer account,
     * so best suggestion is that gives a EOS exchange platform account
     */
    async getNetAndCpuPrice(refAccount = "heztanrqgene") {
        const { body: { net_limit, cpu_limit, net_weight, cpu_weight }, } = await this.getAccountInfo(refAccount);
        const netStaked = net_weight / 10000;
        // convert bytes to kilobytes
        const netAvailable = net_limit.max / 1024;
        const cpuStaked = cpu_weight / 10000;
        // convert microseconds to milliseconds
        const cpuAvailable = cpu_limit.max / 1000;
        if (cpuAvailable === 0 || netAvailable === 0) {
            const errInvalidRefAccount = "[EOS::GetNetAndCpuPrice] " +
                "Available CPU or NET is zero! " +
                "Please check your refAccount and then call this.";
            throw new Error(errInvalidRefAccount);
        }
        return {
            cpuPrice: (cpuStaked / cpuAvailable).toFixed(4),
            netPrice: (netStaked / netAvailable).toFixed(4),
        };
    }
    /**
     * Call producer list,available 1.4 or above,call `getProducerTable` if you run in lower version
     * @param limit count you wanna
     * @param lowBound a-z 1-5
     */
    async getProducerList(limit, lowBound) {
        return this.client.call("/v1/chain/get_producers", {
            json: true,
            limit,
            lower_bound: lowBound,
        });
    }
    /**
     * Call producer list,available 1.0 version or above
     * @param limit count you wanna
     * @param lowBound a-z 1-5
     * @param upperBound a-z 1-5
     * @example find producer list which name start with `a`.
     * getProducerTable({ lowBound: "a", upperBound: "b", limit: 1000 })
     */
    async getProducerTable(lowBound, upperBound, limit = 1000) {
        return this.getTableRows({
            code: "eosio",
            json: true,
            limit,
            lower_bound: lowBound,
            scope: "eosio",
            table: "producers",
            upper_bound: upperBound,
        });
    }
}
exports.EOSClient = EOSClient;
