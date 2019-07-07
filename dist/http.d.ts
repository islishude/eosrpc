/// <reference types="node" />
import http = require("http");
import https = require("https");
export interface IMessage<T> {
    statusCode: number;
    headers: http.IncomingHttpHeaders;
    body: T;
}
export interface IHTTPClient {
    call<T>(url: string, body?: object): Promise<IMessage<T>>;
    setUrl(url: string): void;
    close(): void;
}
export declare class HttpClient implements IHTTPClient {
    url: string;
    timeout: number;
    headers: {
        "Accept": string;
        "Accept-Encoding": string;
        "Agent": string;
        "Content-Type": string;
    };
    httpModule: typeof http | typeof https;
    httpAgent: http.Agent | https.Agent;
    constructor(url: string, keepAlive?: boolean, timeout?: number);
    setUrl(url: string): void;
    call<T>(path: string, data?: any): Promise<IMessage<T>>;
    close(): void;
}
