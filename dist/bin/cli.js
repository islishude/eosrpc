#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repl_1 = require("repl");
const util = require("util");
const http_1 = require("../http");
const rpc_1 = require("../rpc");
const color = {
    _: "\x1b[4m",
    clear: "\x1b[0m",
    yellow: "\x1b[33m",
};
console.log(`
eosrpc repl by isLishude <${color._}https://github.com/islishude/eosrpc${color.clear}>

The available global variables are

${color.yellow}
- HttpClient(default jsonrpc client)
- EOSClient
${color.clear}

Run \`npx -n --experimental-repl-await islishude/eosrpc\` to enable top-level-await.

e.g.
${color.yellow}
  const eosrpc = new EOSClient();
  await eosrpc.getInfo();
${color.clear}
`);
const terminal = repl_1.start({
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
terminal.context.HttpClient = http_1.HttpClient;
terminal.context.EOSClient = rpc_1.EOSClient;
