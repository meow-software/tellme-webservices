import { CanActivate } from '@nestjs/common';
import { match as pathMatch, compile as pathCompile } from 'path-to-regexp';
import { Method } from 'axios';

/**
 * A class type that implements NestJS CanActivate guard.
 */
export type GuardClass = new (...args: any[]) => CanActivate;

/**
 * A guard type that can either be a guard class or an instance of CanActivate.
 */
export type RouteGuardType = GuardClass | CanActivate

/**
 * Defines the configuration of a single route.
 */
export interface RouteConfig {
    /** HTTP method (GET, POST, PUT, DELETE, etc.) */
    method: Method;

    /** Path exposed by the gateway (without the /api prefix) */
    path: string;

    /** Internal target URL where the request is redirected */
    target: {
        /** Target host (e.g., http://localhost:3000) */
        host: string;

        /** Target path (can contain parameters) */
        path: string;
    }

    /** Optional route guards (authorization, validation, etc.) */
    guards?: RouteGuardType[];

    /** Optional rate limiting configuration */
    rateLimit?: {
        /** Maximum number of requests */
        limit: number;

        /** Time-to-live in seconds */
        ttl: number;

        /** Key type used for rate limiting (by ip, user, or both) */
        keyBy?: 'ip' | 'user' | 'ip+user';
    };
}

/**
 * Validates a given path string for parameters and formatting.
 * Throws an error if malformed parameters are found.
 *
 * @param path - Path to check (e.g. "/users/:id")
 * @param type - Context of the path (e.g. "source" or "target")
 * @param verbose - Whether to log details to the console (default: true)
 */
export const checkPath = (path: string, type: string, verbose: boolean = true) => {
  if (verbose) console.log(`Checking ${type} path: ${path}`);
  
  if (path.includes(':')) {
    const params = path.match(/:\w+/g);
    if (verbose) console.log(`  ${type} parameters: ${params ? params.join(', ') : 'None'}`);

    // Check for malformed parameters (invalid characters after ":")
    const malformed = path.match(/:[^a-zA-Z_]/g);
    if (malformed) {
      console.error(`  ❌ MALFORMED ${type} PARAMETERS: ${malformed.join(', ')}`);
      throw new Error(`Invalid parameter in ${type} path: ${path}`);
    }
  }
};

/**
 * Compiles an array of route configurations into executable matchers and compilers.
 * Each route is validated and transformed into:
 * - a matcher function (for checking incoming requests),
 * - a target compiler function (for generating target URLs),
 * - a route key.
 *
 * @param routes - Array of route configurations
 * @param verbose - Whether to log details to the console (default: true)
 * @param mute - Whether to completely silence logs (default: false)
 * @returns Array of compiled route objects
 */
export const compileRoutes = (routes: RouteConfig[], verbose: boolean = true, mute = false) => {
  return routes.map((r) => {
    if (!mute) console.log(`\n🔍 Compiling route: ${r.method} ${r.path}`);
    if (!mute) console.log(`Target: ${r.target.host}${r.target.path}`);
    
    // Validate the source path
    checkPath(r.path, 'source', verbose && !mute);
    
    // Validate the target path (only the path part, not the host)
    checkPath(r.target.path, 'target', verbose && !mute);

    try {
      // Compile the source path matcher
      const matchFn = pathMatch(r.path, { decode: decodeURIComponent });
      if (verbose && !mute) console.log(`\t✓ Source path compiled successfully`);
      
      // Compile the target path compiler
      const compileTargetPath = pathCompile(r.target.path, { encode: encodeURIComponent });
      if (verbose && !mute) console.log(`\t✓ Target path compiled successfully`);

      // Build a function to generate the full target URL
      const compileTarget = (params: Record<string, string> = {}) => {
        const compiledPath = compileTargetPath(params);
        const fullUrl = `${r.target.host}${compiledPath}`;
        if (verbose && !mute) console.log(`\tGenerated target: ${fullUrl}`);
        return fullUrl;
      };

      if (!verbose && !mute) console.log("\tCompiled successfully");
      return {
        config: r,
        matchFn,
        compileTarget,
        routeKey: `${r.method} ${r.path}`,
      };
    } catch (error: any) {
      console.error(`❌ Error compiling route: ${r.method} ${r.path}`);
      console.error(`\tTarget path: ${r.target.path}`);
      console.error(`\tError: ${error.message}`);
      throw error;
    }
  });
};
