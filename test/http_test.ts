import test from "ava";
import http = require("http");
import https = require("https");
import { HttpClient } from "..";

let server: http.Server;

const port = 8000;
const baseUrl = "http://0.0.0.0:8000";

test.before((t) => {
  server = http.createServer(async (req, res) => {
    const chunk: Buffer[] = [];

    req.on("data", (tmp) => {
      chunk.push(tmp);
    });

    req.on("end", () => {
      res.writeHead(200);

      // parse req data
      const data = Buffer.concat(chunk).toString();
      if (data === "timeout") {
        setTimeout(() => {
          res.end(`{"error": "timeout"}`);
        }, 200);
        return;
      }
      res.end("{}");
    });
  });

  server.listen(port, () => {
    t.log("testing server start at", port);
  });
});

test.after((t) => {
  server.close(() => {
    t.log("server close error");
  });
});

test("test http module select", (t) => {
  const client = new HttpClient("http://github.com");
  // @ts-ignore
  t.deepEqual(client.httpAgent.protocol, http.globalAgent.protocol);
  t.deepEqual(client.url, "http://github.com/");

  client.setUrl("https://github.com");
  // @ts-ignore
  t.deepEqual(client.httpAgent.protocol, https.globalAgent.protocol);
  t.deepEqual(client.url, "https://github.com/");

  // test default setting
  // @ts-ignore
  t.deepEqual(client.httpAgent.keepAlive, false);
  t.deepEqual(client.timeout, 10000);
});

test("test http call", async (t) => {
  const client = new HttpClient(baseUrl);
  try {
    await client.call("/");
    t.pass();
  } catch {
    t.fail("want no error");
  }
});

test("test http call timeout", async (t) => {
  const client = new HttpClient(baseUrl, true, 10);
  try {
    await client.call("/v1", "timeout");
    t.fail("want error");
  } catch (e) {
    t.deepEqual(e.message, "timeout");
  }
});
