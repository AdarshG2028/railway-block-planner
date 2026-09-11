export const API_BASE_URL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  errors?: unknown[];
  details?: unknown;
  availableOptions?: unknown[];

  constructor(
    message: string,
    status: number,
    extra?: { errors?: unknown[]; details?: unknown; availableOptions?: unknown[] },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = extra?.errors;
    this.details = extra?.details;
    this.availableOptions = extra?.availableOptions;
  }

  get isEngineOffline() {
    return this.status === 503;
  }
  get isEngineError() {
    return this.status === 502 || this.status === 503;
  }
}

export function errorMessages(err: unknown): string[] {
  if (err instanceof ApiError) {
    const list = (err.errors ?? [])
      .map((e) => {
        if (typeof e === "string") return e;
        if (e && typeof e === "object") {
          const o = e as Record<string, unknown>;
          const path = typeof o["path"] === "string" ? `${o["path"]}: ` : "";
          const msg = typeof o["msg"] === "string" ? o["msg"] : typeof o["message"] === "string" ? o["message"] : "";
          if (msg) return `${path}${msg}`;
        }
        return JSON.stringify(e);
      })
      .filter(Boolean);
    return list.length ? list : [err.message];
  }
  if (err instanceof Error) return [err.message];
  return ["Something went wrong."];
}

const TIMEOUT_MS = 20_000;

type Envelope<T> = {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  pagination?: { page: number; limit: number; total: number; totalPages: number };
  errors?: unknown[];
  details?: unknown;
  availableOptions?: unknown[];
};

async function request<T>(
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<Envelope<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: init?.method ?? "GET",
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
      body: init?.body ? JSON.stringify(init.body) : undefined,
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    if ((e as Error).name === "AbortError") {
      throw new ApiError("The request took too long and was cancelled.", 0);
    }
    throw new ApiError(`Cannot reach the backend at ${API_BASE_URL}.`, 0);
  }
  clearTimeout(timer);

  let json: Envelope<T> | null = null;
  try {
    json = (await res.json()) as Envelope<T>;
  } catch {
    json = null;
  }

  if (!res.ok || !json?.success) {
    throw new ApiError(json?.message ?? `Request failed (${res.status})`, res.status, {
      errors: json?.errors,
      details: json?.details,
      availableOptions: json?.availableOptions,
    });
  }
  return json;
}

export async function apiGet<T>(path: string) {
  return request<T>(path);
}
export async function apiPost<T>(path: string, body?: unknown) {
  return request<T>(path, { method: "POST", body: body ?? {} });
}
export async function apiPatch<T>(path: string, body?: unknown) {
  return request<T>(path, { method: "PATCH", body: body ?? {} });
}

export function qs(params: Record<string, string | number | undefined | null>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}
