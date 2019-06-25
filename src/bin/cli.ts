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
- HttpClient(default http client)
- EOSClient
${color.clear}

See the README to learn more API.

e.g.
${color.yellow}
  let client = new HttpClient({ url: 'http://peer1.eoshuobipool.com:8181' })
  let eos = new EOSClient(client);
  await eth.getBlockCount(client);
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
