import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import * as crypto from "node:crypto";
import { GetHeadersType, HeaderTypes } from "./types.interface";
import { DateTime } from "luxon";
import { HTTP_METHOD } from "./global.enum";

class FuzeClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly client: AxiosInstance;

  public static HTTP_METHOD = HTTP_METHOD;

  constructor({
    baseUrl,
    apiKey,
    apiSecret,
  }: {
    baseUrl: string;
    apiKey: string;
    apiSecret: string;
  }) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!apiKey || !apiSecret) {
      throw Promise.reject(
        new Error("Client initialization failed. Missing API key or secret.")
      );
    }

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const headers = this.getHeaders({
          body: config.data || {},
          query: config.params || {},
          url: config?.url?.replace(this.baseUrl, "") || "",
          secret: this.apiSecret,
          key: this.apiKey,
        });
        config.headers["X-API-KEY"] = headers["X-API-KEY"];
        config.headers["X-TIMESTAMP"] = headers["X-TIMESTAMP"];
        config.headers["X-SIGNATURE"] = headers["X-SIGNATURE"];
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
  }

  private getHeaders = ({
    body = {},
    query = {},
    url,
    secret,
    key,
  }: HeaderTypes): GetHeadersType => {
    const ts = Math.round(DateTime.utc().toSeconds() + 3600);
    const hmac3 = crypto.createHmac("sha256", secret);
    const payload = JSON.stringify({
      body: body,
      query: query,
      url: `${url}`,
      ts: `${ts}`,
    });
    hmac3.update(payload);
    const signature = hmac3.digest("hex");
    return {
      "X-API-KEY": key,
      "X-TIMESTAMP": `${ts}`,
      "X-SIGNATURE": signature,
    };
  };

  async request(path: string, method: HTTP_METHOD, body?: object) {
    const url = `${this.baseUrl}${path}`;
    const res = await this.client({
      url,
      method,
      ...(method === HTTP_METHOD.GET ? { params: body } : { data: body }),
    });
    return res.data;
  }
}

export default FuzeClient;
