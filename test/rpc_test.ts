import test from "ava";
import { EOSClient, HttpClient } from "../dist";

const baseurl = "http://api-mainnet.starteos.io/";
const HttpProvider = new HttpClient(baseurl);
const rpcclient = new EOSClient(HttpProvider);

test("test get info", async (t) => {
  try {
    const { body } = await rpcclient.getInfo();
    t.deepEqual(typeof body.server_version, "string");
    t.deepEqual(typeof body.chain_id, "string");
    t.deepEqual(typeof body.head_block_num, "number");
    t.deepEqual(typeof body.last_irreversible_block_num, "number");
    t.deepEqual(typeof body.last_irreversible_block_id, "string");
    t.deepEqual(typeof body.head_block_id, "string");
    t.deepEqual(typeof body.head_block_time, "string");
    t.deepEqual(typeof body.head_block_producer, "string");
    t.deepEqual(typeof body.virtual_block_cpu_limit, "number");
    t.deepEqual(typeof body.virtual_block_net_limit, "number");
    t.deepEqual(typeof body.block_cpu_limit, "number");
    t.deepEqual(typeof body.block_net_limit, "number");
    t.deepEqual(typeof body.server_version_string, "string");
  } catch (e) {
    t.fail("wants no error");
  }
});

test("test getBlock with height", async (t) => {
  try {
    const { body } = await rpcclient.getBlock(100);
    // @ts-ignore
    t.deepEqual(body.error, undefined);
  } catch (e) {
    t.fail("want no error");
  }
});

test("test getBlock with blcok hash", async (t) => {
  try {
    const { body } = await rpcclient.getBlock(
      "0000006492871283c47f6ef57b00cf534628eb818c34deb87ea68a3557254c6b",
    );
    // @ts-ignore
    t.deepEqual(body.error, undefined);
  } catch (e) {
    t.fail("want no error");
  }
});

test("test getAccountInfo", async (t) => {
  try {
    const { body } = await rpcclient.getAccountInfo("lsdislishude");
    // @ts-ignore
    t.deepEqual(body.error, undefined);
  } catch (e) {
    t.fail("want no error");
  }
});

test("test getCurrentStats", async (t) => {
  try {
    const { body } = await rpcclient.getCurrentStats("eosio.token", "EOS");
    // @ts-ignore
    t.deepEqual(body.error, undefined);
  } catch (e) {
    t.fail("want no error");
  }
});

// test("test getCode", async (t) => {
//   try {
//     const { body } = await rpcclient.getCode("eosio.token");
//     // @ts-ignore
//     t.deepEqual(body.error, undefined);
//   } catch (e) {
//     t.fail("want no error");
//   }
// });

test("test getKeyAccount", async (t) => {
  try {
    const pubkey = "EOS5Q56udttmB39CJj1t5nFZ5DFQNpJTrGr6bsNPH6xARqKRc8AAf";
    const { body } = await rpcclient.getKeyAccount(pubkey);
    // @ts-ignore
    t.deepEqual(body.error, undefined);
  } catch (e) {
    t.fail("want no error");
  }
});
