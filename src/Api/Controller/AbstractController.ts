import { Next } from "koa";
import { Connection } from "typeorm";
import { connection } from "../../Connection.js";
import { createHttpError } from '../Error/index.js';
import { AppContext, Middleware } from "../../Type/index.js";
import { handleError } from "../Error/index.js";

export abstract class AbstractConteroller {
    protected connection: Connection = connection;

    protected createMiddleware(func: (ctx: AppContext) => Promise<unknown>): Middleware {
        return async (ctx: AppContext, next: Next) => {
            try {
                await func(ctx);
            } catch(error) {
                const { status, body } = handleError(error);
                ctx.status = status;
                ctx.body = body;
            }

            await next();
        } 
    }
}