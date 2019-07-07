"use strict";
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
                try {
                    const body = [];
                    for await (const chunk of res) {
                        body.push(chunk);
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
