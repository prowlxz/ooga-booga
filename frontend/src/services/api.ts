const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

// Reusable function for sending requests to the backend.
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Handle unsuccessful responses.
  if (!response.ok) {
    let message = "Something went wrong. Please try again.";

    try {
      const errorData = await response.json();
      message = errorData.detail ?? message;
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  // Handle responses without a body, such as HTTP 204.
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
