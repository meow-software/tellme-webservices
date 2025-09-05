import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpProxy } from '@tellme/ws-core';
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Axios-based implementation of the HttpProxy interface.
 * Provides a simple wrapper around Axios with a base URL and
 * convenience methods for common HTTP verbs.
 */
export class AxiosProxy implements HttpProxy {
    /** Axios client instance */
    protected readonly client: AxiosInstance;

    /** Base URL for all requests */
    protected baseURL: string;

    /**
     * Creates a new AxiosProxy.
     * 
     * @param baseURL - The base URL for requests (e.g., "http://localhost:3000/api")
     */
    constructor(baseURL: string) {
        this.client = axios.create({
            timeout: 5000, // default timeout of 5 seconds
        });
        this.baseURL = baseURL;
    }

    /**
     * Returns the base URL for this client.
     */
    getBaseUrl(): string {
        return this.baseURL;
    }

    protected catchError(error: any) {
        if (axios.isAxiosError(error) && error.response) {
            throw new HttpException(
                {
                    error: error.response.data.error,
                    message: error.response.data.message,
                },
                error.response.status,
            );
        }
        throw error; // Unknow Error (network, timeout, etc.)
    }

    /**
     * Sends a GET request.
     * 
     * @param target - Relative target path
     * @param config - Optional Axios request configuration
     */
    async get<T>(target: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const { data } = await this.client.get<T>(this.getBaseUrl() + target, config);
            return data;
        } catch (error) {
            throw this.catchError(error);
        }
    }

    /**
     * Sends a POST request.
     * 
     * @param target - Relative target path
     * @param data - Optional request body
     * @param config - Optional Axios request configuration
     */
    async post<T>(target: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const { data: res } = await this.client.post<T>(this.getBaseUrl() + target, data, config);
            return res;
        } catch (error) {
            throw this.catchError(error);
        }
    }

    /**
     * Sends a PUT request.
     * 
     * @param target - Relative target path
     * @param data - Optional request body
     * @param config - Optional Axios request configuration
     */
    async put<T>(target: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const { data: res } = await this.client.put<T>(this.getBaseUrl() + target, data, config);
        return res;
    }

    /**
     * Sends a PATCH request.
     * 
     * @param target - Relative target path
     * @param data - Optional request body
     * @param config - Optional Axios request configuration
     */
    async patch<T>(target: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const { data: res } = await this.client.patch<T>(this.getBaseUrl() + target, data, config);
            return res;
        } catch (error) {
            throw this.catchError(error);
        }
    }

    /**
     * Sends a DELETE request.
     * 
     * @param target - Relative target path
     * @param config - Optional Axios request configuration
     */
    async delete<T>(target: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const { data } = await this.client.delete<T>(this.getBaseUrl() + target, config);
            return data;
        } catch (error) {
            throw this.catchError(error);
        }
    }
}
