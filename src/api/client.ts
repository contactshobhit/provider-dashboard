export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch ${endpoint}`,
      response.status,
      endpoint
    );
  }
  return response.json();
}

export async function apiPost<T, R>(endpoint: string, data: T): Promise<R> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new ApiError(
      `Failed to post to ${endpoint}`,
      response.status,
      endpoint
    );
  }
  return response.json();
}

export async function apiPut<T, R>(endpoint: string, data: T): Promise<R> {
  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new ApiError(
      `Failed to update ${endpoint}`,
      response.status,
      endpoint
    );
  }
  return response.json();
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint, { method: 'DELETE' });
  if (!response.ok) {
    throw new ApiError(
      `Failed to delete ${endpoint}`,
      response.status,
      endpoint
    );
  }
  return response.json();
}
