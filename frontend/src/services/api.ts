const BASE_URL = 'http://localhost:5008/api';

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      headers[key] = value as string;
    });
  }

  const token = typeof window !== 'undefined'
    ? (window.sessionStorage.getItem('accessToken') || window.localStorage.getItem('accessToken'))
    : null;

  console.log("Enviando token no Header:", token);

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = `Erro HTTP ${response.status}: Ocorreu um erro na requisicao.`;

    if (response.status === 401 || response.status === 403) {
      errorMessage = "Sessão expirada ou não autorizada. Por favor, faça login novamente.";
    } else {
      try {
        const text = await response.text();
        if (text) {
          try {
            const data = JSON.parse(text);
            if (typeof data === 'string') {
              errorMessage = data;
            } else if (data.errors && typeof data.errors === 'object') {
              const details = Object.entries(data.errors)
                .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                .join(' | ');
              errorMessage = details || data.title || errorMessage;
            } else if (data.message) {
              errorMessage = data.message;
            } else if (data.title) {
              errorMessage = data.title;
            } else if (data.detail) {
              errorMessage = data.detail;
            }
          } catch {
            errorMessage = text;
          }
        }
      } catch {
      }
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
