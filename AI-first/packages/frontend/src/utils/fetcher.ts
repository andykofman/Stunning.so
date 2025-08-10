export type Json = unknown;

export async function fetcher<T extends Json = Json>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const error = new Error(`HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`);
    // @ts-expect-error augment
    error.status = res.status;
    throw error;
  }
  // Try JSON, fall back to text
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}


