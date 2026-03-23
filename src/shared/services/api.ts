import { getIdToken } from "@/lib/firebase";
import { BASE_URL } from "@/shared/constants/app";

export class ApiException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly body: string
  ) {
    super(`ApiException(${statusCode}): ${ApiException.parseMessage(body)}`);
    this.name = "ApiException";
  }

  override get message(): string {
    return ApiException.parseMessage(this.body);
  }

  private static parseMessage(body: string): string {
    try {
      const json = JSON.parse(body);
      return (json.error as string) ?? body;
    } catch {
      return body;
    }
  }
}

async function buildHeaders(auth: boolean): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = await getIdToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res: Response): Promise<unknown> {
  if (res.status >= 400) {
    const body = await res.text();
    throw new ApiException(res.status, body);
  }
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

export const ApiService = {
  async get<T>(path: string, { auth = false }: { auth?: boolean } = {}): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: await buildHeaders(auth),
      cache: "no-store",
    });
    return handleResponse(res) as Promise<T>;
  },

  async post<T>(
    path: string,
    { body, auth = false }: { body?: unknown; auth?: boolean } = {}
  ): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: await buildHeaders(auth),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse(res) as Promise<T>;
  },

  async patch<T>(
    path: string,
    { body, auth = false }: { body?: unknown; auth?: boolean } = {}
  ): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: await buildHeaders(auth),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse(res) as Promise<T>;
  },

  async delete<T>(
    path: string,
    { auth = false, body }: { auth?: boolean; body?: unknown } = {}
  ): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: await buildHeaders(auth),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse(res) as Promise<T>;
  },
};
