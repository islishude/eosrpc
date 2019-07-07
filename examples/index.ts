import { EOSClient, HttpClient } from "@islishude/eosrpc";

const main = async () => {
  const conf = {
    baseurl: "http://192.168.0.1:8080",
    keepAlive: true,
    timeout: 10 * 1000,
  };
  const httpProvider = new HttpClient(
    conf.baseurl,
    conf.keepAlive,
    conf.timeout,
  );

  const eosrpc = new EOSClient(httpProvider);

  // or use default http provider
  // baseurl = http://127.0.0.1:8080
  // timeout = 10 * 1000
  // keepAlive = false
  // const eosrpc = new EOSClient()

  const { body, headers, statusCode } = await eosrpc.getInfo();
  console.log(body, headers, statusCode);

  // if you set keepAlive
  // you should close at the end
  httpProvider.close();
};

main()
  .catch(console.error)
  .finally(() => process.exit(0));
