import { RouteConfig } from "src/lib";

export const AUTH_SERVICE_HOST = process.env.AUTH_SERVICE_HOST ?? 'http://localhost:3001';

export const authRouteConfig: RouteConfig[] = [
  { 
    method: 'POST', 
    path: '/auth/login',  
    target: {
      host: AUTH_SERVICE_HOST,
      path: '/auth/login'
    },
    rateLimit: { limit: 5, ttl: 60 } 
  },
  { 
    method: 'POST', 
    path: '/auth/register', 
    target: {
      host: AUTH_SERVICE_HOST,
      path: '/auth/register'
    },
    rateLimit: { limit: 5, ttl: 60 } 
  },
  { 
    method: 'GET', 
    path: '/auth/register/confirm', 
    target: {
      host: AUTH_SERVICE_HOST,
      path: '/auth/register/confirm'
    },
    rateLimit: { limit: 5, ttl: 60 } 
  },
  { 
    method: 'POST', 
    path: '/auth/register/confirm/resend', 
    target: {
      host: AUTH_SERVICE_HOST,
      path: '/auth/register/confirm/resend'
    },
    rateLimit: { limit: 5, ttl: 60 } 
  },
  { 
    method: 'POST', 
    path: '/auth/bot/login', 
    target: {
      host: AUTH_SERVICE_HOST,
      path: '/auth/bot/login'
    },
    rateLimit: { limit: 5, ttl: 60 } 
  },
  { 
    method: 'GET', 
    path: '/auth/refresh', 
    target: {
      host: AUTH_SERVICE_HOST,
      path: '/auth/refresh'
    },
    rateLimit: { limit: 5, ttl: 60 } 
  },
  { 
    method: 'GET', 
    path: '/auth/logout', 
    target: {
      host: AUTH_SERVICE_HOST,
      path: '/auth/logout'
    },
    rateLimit: { limit: 5, ttl: 60 } 
  },
];