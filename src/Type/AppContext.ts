import {ExtendableContext} from "koa";
import {IRouterParamContext} from "koa-router";
import {Connection} from "typeorm";



export type AppContext = ExtendableContext
    & { state: any }
    & IRouterParamContext<any, {}>
    & {body: object, response: { body: object }}
    & { db: Connection }
;