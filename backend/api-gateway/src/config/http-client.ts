export class HttpClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number = 5000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (erro: any) {
      clearTimeout(timeoutId);
      if (erro.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw erro;
    }
  }

  async get<T>(url: string, token?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await this.fetchWithTimeout(`${this.baseURL}${url}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || `HTTP Error ${response.status}`);
    }

    return await response.json();
  }

  async post<T>(url: string, data: any, token?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await this.fetchWithTimeout(`${this.baseURL}${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || `HTTP Error ${response.status}`);
    }

    return await response.json();
  }

  async put<T>(url: string, data: any, token?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await this.fetchWithTimeout(`${this.baseURL}${url}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || `HTTP Error ${response.status}`);
    }

    return await response.json();
  }

  async delete<T>(url: string, token?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await this.fetchWithTimeout(`${this.baseURL}${url}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || `HTTP Error ${response.status}`);
    }

    return await response.json();
  }
}