# eosrpc [![Build Status](https://travis-ci.org/islishude/eosrpc.svg?branch=master)](https://travis-ci.org/islishude/eosrpc)

type-safe EOS jsonrpc client

### Enviorment

- Node.js >= 12.0.0
- EOS >= 1.3.0

## Install

```shell
# install from github instead of npm registry
npm install islishude/eosrpc
```

## REPL

### Install

```shell
npx -n experimental-repl-await islishude/eosrpc
```

### Usage

```typescript
const eosrpc = new EOSClient();
await eosrpc.getInfo();
```

## Examples

[See examples folder](./examples/index.ts)

## EOS Actions

- [eosio.token](https://github.com/isLishude/eos-actions-types/blob/master/eosio.token.d.ts)
- [eosio](https://github.com/isLishude/eos-actions-types/blob/master/eosio.d.ts)
