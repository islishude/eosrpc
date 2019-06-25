import http = require("http");
import https = require("https");
import { version as PkgVer } from "./version";

export interface IMessage<T> {
  statusCode: number;
  headers: http.IncomingHttpHeaders;
  body: T;
}
export interface IHTTPClient {
  Post<T>(url: string, body?: object): Promise<IMessage<T>>;
}

export class HttpClient implements IHTTPClient {
  public url: string;
  private httpAgent: http.Agent | https.Agent;
  private httpModule: typeof http | typeof https;

  private headers = {
    "Accept": "application/json",
    "Accept-Encoding": "identity",
    "Agent": `eosrpc/${PkgVer}`,
    "Content-Type": "application/json",
  };

  public constructor(
    url: string,
    keepAlive: boolean = false,
    timeout: number = 10 * 1000,
  ) {
    this.httpModule = /^https:.+$/g.test(url) ? https : http;
    this.httpAgent = new this.httpModule.Agent({ keepAlive, timeout });
    this.url = url;
  }

  public Post<T>(url: string, data: object = {}): Promise<IMessage<T>> {
    return new Promise<IMessage<T>>((resolve, reject) => {
      const client = this.httpModule.request(
        this.url + url,
        {
          agent: this.httpAgent,
          headers: this.headers,
        },
        (res) => {
          res.on("error", reject);

          const chunk: Buffer[] = [];
          res.on("data", (tmp) => {
            chunk.push(tmp);
          });

          res.on("end", () => {
            const returns: IMessage<T> = {
              body: JSON.parse(Buffer.concat(chunk).toString()),
              headers: res.headers,
              statusCode: res.statusCode as number,
            };
            resolve(returns);
          });
        },
      );

      const reqBuffer = Buffer.from(JSON.stringify(data));
      client.setHeader("Content-Length", Buffer.byteLength(reqBuffer));
      client.write(data);

      client.on("timeout", () => reject(new Error("timeout")));
    });
  }
}
