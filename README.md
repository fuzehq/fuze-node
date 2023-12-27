## Introduction

This is a simple wrapper typescript library to get started with [Fuze](https://fuzefinance.com)
libraries.

For more infromation about supported endpoints please refer our [docs](https://docs.fuze.finance)

## Building the library

```
npm run build
```

## Running the sample code

1. First update `src/example.ts` with your `API_KEY` and `API_SECRET`.
2. Build the code using `npm run build`.
3. Now run the example `node dist/example.js`.

## Example

```js
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
```
