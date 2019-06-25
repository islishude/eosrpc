export type account_name = string;
export type asset = "1.001 EOS";
export type EOSVersion = "v1";

export interface IEosAuthority {
  threshold: number;
  keys: Array<{
    key: string;
    weight: number;
  }>;
  account: Array<{
    permission: {
      actor: account_name;
      permission_name: string;
    };
    weight: number;
  }>;
  waits: Array<{
    wait_sec: number;
    weight: number;
  }>;
}

export interface IEosTrx {
  // executed  = 0 ///< succeed, no error handler executed
  // soft_fail = 1 ///< objectively failed (not executed), error handler executed
  // hard_fail = 2 ///< objectively failed and error handler objectively failed thus no state change
  // delayed   = 3 ///< transaction delayed/deferred/scheduled for future execution
  // expired   = 4  ///< transaction expired and storage space refunded to user
  status: "executed" | "soft_fail" | "hard_fail" | "delayed" | "expired";
  // millisecond
  cpu_usage_us: number;
  // bytes
  net_usage_words: number;
  // `trx` may be a `string`
  trx:
    | string
    | {
        // txid
        id: string;
        signatures: string[];
        compression: "none" | "zlib";
        packed_context_free_data: string;
        context_free_data: string[];
        packed_trx: string;
        transaction: {
          expiration: string;
          ref_block_num: number;
          ref_block_prefix: number;
          max_net_usage_ms: number;
          max_cpu_usage_ms: number;
          delay_sec: number;
          context_free_actions: any[];
          authorization: Array<{ actor: string; permission: string }>;
          actions: Array<{
            // EOS transfer is "eosio.token"
            account: account_name;
            name: string;
            authorization: IEosAuthority[];
            data: any;
            hex_data: string;
          }>;
          transaction_extensions: any[];
        };
      };
}

export interface IEosChainInfo {
  server_version: string;
  chain_id: string;
  head_block_num: number;
  last_irreversible_block_num: number;
  last_irreversible_block_id: string;
  head_block_id: string;
  head_block_time: string;
  head_block_producer: string;
  virtual_block_cpu_limit: number;
  virtual_block_net_limit: number;
  block_cpu_limit: number;
  block_net_limit: number;
  server_version_string: string;
}

export interface IEosBlockInfo {
  timestamp: string;
  producer: string;
  confirmed: number;
  previous: string;
  transaction_mroot: string;
  action_mroot: string;
  schedule_version: number;
  new_producers: any;
  header_extensions: any[];
  producer_signature: string;
  transactions: IEosTrx[];
  block_extensions: any[];
  id: string;
  block_num: number;
  ref_block_prefix: number;
}

export interface IEosAccount {
  account_name: string;
  head_block_number: number;
  head_block_time: string;
  privileged: boolean;
  last_code_update: string;
  created_at: string;
  // Your all RAM
  ram_quota: number;
  // Your RAM usage
  ram_usage: number;
  net_weight: number;
  cpu_weight: number;

  net_limit: {
    used: number;
    available: number;
    max: number;
  };

  cpu_limit: {
    used: number;
    available: number;
    max: number;
  };
  permissions: Array<{
    perm_name: string;
    parent: account_name;
    required_auth: {
      threshold: number;
      key: Array<{ key: string; weight: number }>;
    };
    accounts: Array<{
      permission: {
        actor: account_name;
        permission_name: string;
      };
      weight: number;
    }>;
    waits: Array<{
      wait_sec: number;
      weight: number;
    }>;
  }>;
  total_resources: {
    owner: account_name;
    net_weight: asset;
    cpu_weight: asset;
    ram_bytes: number;
  };
  self_delegated_bandwidth: {
    from: account_name;
    to: account_name;
    net_weight: asset;
    cpu_weight: asset;
  };
  refund_request: null | {
    owner: account_name;
    request_time: string;
    net_amount: asset;
    cpu_amount: asset;
  };
  voter_info: {
    owner: account_name;
    proxy: account_name;
    producers: account_name[];
    staked: number;
    last_vote_weight: string;
    proxied_vote_weight: string;
    // number 0 | 1
    is_proxy: boolean;
  };
}

export interface IEosAbi {
  version: string;
  types: Array<{ new_type_name: string; type: string }>;
  structs: Array<{
    name: string;
    base: string;
    fields: Array<{ name: string; type: string }>;
  }>;
  actions: Array<{ name: string; type: string; ricardian_contract: string }>;
  tables: Array<{
    name: string;
    type: string;
    index_type: string;
    key_names: string[];
    key_types: string[];
  }>;
  ricardian_clauses: Array<{ id: string; body: string }>;
  error_messages: Array<{ error_code: string; error_msg: string }>;
  abi_extensions: Array<{ tag: number; value: string }>;
  variants?: Array<{ name: string; types: string[] }>;
}

export interface IEosError {
  code: number;
  message: string;
  error: {
    code: number;
    name: string;
    what: string;
    detail: Array<{
      message: string;
      file: string;
      method: string;
      line: number;
    }>;
  };
}

export interface IEosRamTable {
  supply: string;
  base: { balance: string; weight: string };
  quote: { balance: string; weight: string };
}

export interface IEosProdsTable {
  owner: string;
  total_votes: string;
  producer_key: string;
  is_active: number;
  url: string;
  unpaid_blocks: number;
  last_claim_time: number;
  location: number;
}

export interface IEosProds {
  rows: IEosProdsTable[];
  total_producer_vote_weight: string;
  more: string;
}
