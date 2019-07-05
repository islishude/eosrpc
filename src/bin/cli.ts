#!/usr/bin/env node
import { start } from "repl";
import util = require("util");
import { HttpClient } from "../http";
import { EOSClient } from "../rpc";

const color = {
  _: "\x1b[4m",
  clear: "\x1b[0m",
  yellow: "\x1b[33m",
};

console.log(`
eosrpc repl by isLishude <${color._}https://github.com/islishude/eosrpc${
  color.clear
}>

The available global variables are

${color.yellow}
- HttpClient(default jsonrpc client)
- EOSClient
${color.clear}

Run \`npx -n --experimental-repl-await eosrpc\` to enable top-level-await.

e.g.
${color.yellow}
  const HttpProvider = new HttpClient({ url: "http://127.0.0.1:8545" });
  const EthClient = new EOSClient(HttpProvider);
${color.clear}
`);

const terminal = start({
  ignoreUndefined: true,
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
  terminal: process.stdout.isTTY,
  useGlobal: true,
  writer(value) {
    return util.inspect(value, {
      showHidden: false,
      depth: null,
      customInspect: true,
      colors: true,
      maxArrayLength: null,
      breakLength: 80,
      compact: false,
      sorted: false,
      // @ts-ignore
      getters: false,
    });
  },
});

terminal.context.HttpClient = HttpClient;
terminal.context.EOSClient = EOSClient;
