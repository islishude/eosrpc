"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const https = require("https");
const urllib = require("url");
const version_1 = require("./version");
class HttpClient {
    constructor(url, keepAlive = false, timeout = 10 * 1000) {
        this.headers = {
            "Accept": "application/json",
            "Accept-Encoding": "identity",
            "Agent": `eosrpc/${version_1.version}`,
            "Content-Type": "application/json",
        };
        const path = new urllib.URL(url);
        this.httpModule = path.protocol === "https:" ? https : http;
        this.httpAgent = new this.httpModule.Agent({ keepAlive });
        this.url = path.toString();
        this.timeout = timeout;
    }
    setUrl(url) {
        const path = new urllib.URL(url);
        // @ts-ignore
        if (path.protocol !== this.httpAgent.protocol) {
            this.httpModule = path.protocol === "https:" ? https : http;
            this.httpAgent = new this.httpModule.Agent({
                // @ts-ignore
                keepAlive: this.httpAgent.keepAlive,
            });
        }
        this.url = path.toString();
    }
    call(path, data = "") {
        return new Promise((resolve, reject) => {
            const reqPath = urllib.resolve(this.url, path);
            const client = this.httpModule.request(reqPath, {
                method: "POST",
                agent: this.httpAgent,
                headers: this.headers,
                timeout: this.timeout,
            }, async (res) => {
                var e_1, _a;
                try {
                    const body = [];
                    try {
                        for (var res_1 = __asyncValues(res), res_1_1; res_1_1 = await res_1.next(), !res_1_1.done;) {
                            const chunk = res_1_1.value;
                            body.push(chunk);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (res_1_1 && !res_1_1.done && (_a = res_1.return)) await _a.call(res_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    const respData = {
                        body: JSON.parse(Buffer.concat(body).toString()),
                        headers: res.headers,
                        statusCode: res.statusCode,
                    };
                    resolve(respData);
                }
                catch (e) {
                    reject(e);
                }
            });
            const reqBuffer = typeof data === "string"
                ? Buffer.from(data)
                : Buffer.from(JSON.stringify(data));
            client.setHeader("Content-Length", Buffer.byteLength(reqBuffer));
            client.write(reqBuffer);
            client.on("timeout", () => reject(new Error("timeout")));
            client.on("error", reject);
        });
    }
    close() {
        this.httpAgent.destroy();
    }
}
exports.HttpClient = HttpClient;
