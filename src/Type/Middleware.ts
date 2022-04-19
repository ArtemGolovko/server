import { AppContext } from "./AppContext.js";
import { Next } from "koa";

export type Middleware = (ctx: AppContext, next: Next) => Promise<unknown>;