import FuzeClient from "./index";
const fuzeClient = new FuzeClient({
  apiKey: "YOUR_API_KEY",
  apiSecret: "YOUR_API_SECRET",
  baseUrl: "https://dev.api.fuze.finance",
});

const main = async () => {
  const result = await fuzeClient.request(
    "/api/v1/org",
    FuzeClient.HTTP_METHOD.GET
  );
  console.log(result);
};

main();
