import { Request, Response } from 'express';
import axios, { Method } from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

export class Proxy {
    /**
     * Forward an incoming request to the target service.
     *
     * @param req  The original Express request from NestJS
     * @param res  The original Express response to write back to client
     * @param targetUrl Absolute target URL of the destination microservice
     */
    static async forward(req: Request, res: Response, targetUrl: string, options: { method?: Method } = {}) {
        try {
            // 1) Preserve original HTTP method (GET, POST, PUT, DELETE, etc.)
            const method = req.method as Method;

            // 2) Copy headers. Remove "host" to avoid mismatch with target service.
            const headers = { ...req.headers };
            delete headers['host'];
            delete headers['content-length'];
            delete headers['transfer-encoding'];

            // 3) Handle query string (already present in targetUrl if you built it)
            // -> Nothing special to do here

            // 4) Prepare request body
            let data: any = undefined;

            if (method !== 'GET' && method !== 'HEAD') {
                // For all non-GET requests, use the parsed body
                data = req.body;
            }
            // 5) Forward the request using axios
            const response = await axios.request({
                url: targetUrl,
                method,
                headers,
                data,
                // timeout: 10000
            });
            // 6) Return the response to the client
            return response.data

        } catch (err: any) {
            // console.error("Proxy forward error:", err.message);

            // 1. HttpException (Nest)
            if (err instanceof HttpException) {
                throw err; 
            }

            // 2. Axios error from webservice
            if (axios.isAxiosError(err) && err.response) {
                throw new HttpException(
                    err.response.data ?? { error: "UNKNOWN_ERROR", message: "Unknown error from web-service." },
                    err.response.status
                );
            }

            // 3. Erreur Node, network, etc.
            throw new HttpException(
                {
                    error: "PROXY_ERROR",
                    message: err.message || "Unknown proxy error",
                },
                HttpStatus.BAD_GATEWAY
            );
        }
    }
}