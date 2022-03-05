import {AppContext} from "./AppContext";
import {Next} from "koa";

interface RouteInterface {
    path: string,
    method: "get"|"post"|"put"|"delete",
    name?: string,
    middleware: (ctx: AppContext, next: Next) => Promise<unknown>
}

export type Route = RouteInterface;