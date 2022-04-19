import type { Middleware } from "./Middleware.js";


interface RouteInterface {
    path: string,
    method: "get"|"post"|"put"|"delete",
    name?: string,
    middleware: Middleware
}

export type Route = RouteInterface;