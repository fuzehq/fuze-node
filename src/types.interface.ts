export interface HeaderTypes {
  body: object;
  query: object;
  url: string;
  secret: string;
  key: string;
}

export interface GetHeadersType {
  "X-API-KEY": string;
  "X-TIMESTAMP": string;
  "X-SIGNATURE": string;
}
