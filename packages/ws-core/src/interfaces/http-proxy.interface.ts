/**
 * Interface defining a generic HTTP proxy client.
 * Provides standard CRUD methods with a base URL.
 */
export interface HttpProxy {
    /** Returns the base URL used by the client */
    getBaseUrl(): string;

    /** Executes a GET request */
    get<T = any>(target: string, config?: any): Promise<T>;

    /** Executes a POST request */
    post<T = any>(target: string, data?: any, config?: any): Promise<T>;

    /** Executes a PUT request */
    put<T = any>(target: string, data?: any, config?: any): Promise<T>;

    /** Executes a PATCH request */
    patch<T = any>(target: string, data?: any, config?: any): Promise<T>;

    /** Executes a DELETE request */
    delete<T = any>(target: string, config?: any): Promise<T>;
}
