import { Next } from "koa";
import { AppContext } from "../Type/index.js";

export const CORSandCSP = async (ctx: AppContext, next: Next) => {
    ctx.set({
        'Access-Control-Allow-Origin': ctx.request.header['origin'] ?? '*',
        'Access-Control-Allow-Methods': 'GET POST PUT DELETE OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Content-Security-Policy': 'default-src ' + ctx.request.header['origin'] ?? 'self'
    });
    
    await next();
}