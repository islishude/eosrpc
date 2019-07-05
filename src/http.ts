import http = require("http");
import https = require("https");
import urllib = require("url");
import { version as PkgVer } from "./version";

export interface IMessage<T> {
  statusCode: number;
  headers: http.IncomingHttpHeaders;
  body: T;
}
export interface IHTTPClient {
  call<T>(url: string, body?: object): Promise<IMessage<T>>;
  setUrl(url: string): void;
}

export class HttpClient implements IHTTPClient {
  public url: string;
  public timeout: number;
  public headers = {
    "Accept": "application/json",
    "Accept-Encoding": "identity",
    "Agent": `eosrpc/${PkgVer}`,
    "Content-Type": "application/json",
  };
  public httpModule: typeof http | typeof https;
  public httpAgent: http.Agent | https.Agent;

  public constructor(
    url: string,
    keepAlive: boolean = false,
    timeout: number = 10 * 1000,
  ) {
    const path = new urllib.URL(url);
    this.httpModule = path.protocol === "https:" ? https : http;
    this.httpAgent = new this.httpModule.Agent({ keepAlive });
    this.url = path.toString();
    this.timeout = timeout;
  }

  public setUrl(url: string) {
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

  public call<T>(path: string, data: any = ""): Promise<IMessage<T>> {
    return new Promise<IMessage<T>>((resolve, reject) => {
      const reqPath = urllib.resolve(this.url, path);
      const client = this.httpModule.request(
        reqPath,
        {
          method: "POST",
          agent: this.httpAgent,
          headers: this.headers,
          timeout: this.timeout,
        },
        async (res) => {
          try {
            const body: Buffer[] = [];
            for await (const chunk of res) {
              body.push(chunk);
            }

            const respData: IMessage<T> = {
              body: JSON.parse(Buffer.concat(body).toString()),
              headers: res.headers,
              statusCode: res.statusCode as number,
            };
            resolve(respData);
          } catch (e) {
            reject(e);
          }
        },
      );

      const reqBuffer =
        typeof data === "string"
          ? Buffer.from(data)
          : Buffer.from(JSON.stringify(data));
      client.setHeader("Content-Length", Buffer.byteLength(reqBuffer));
      client.write(reqBuffer);

      client.on("timeout", () => reject(new Error("timeout")));
      client.on("error", reject);
    });
  }
}
