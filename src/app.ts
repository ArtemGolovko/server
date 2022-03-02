import "reflect-metadata";

import * as Koa from "koa";
import * as Router from "koa-router";

import * as logger from "koa-logger";
import  * as bodyParser from "koa-bodyparser";
import {Connection, ConnectionOptions, createConnection} from "typeorm";
import { config } from "dotenv";
import {User} from "./Entity/User";
import {ExtendableContext} from "koa";
import {IRouterParamContext} from "koa-router";

config({
    path: __dirname + "/.env"
});

(async () => {
    const app = new Koa<any, { db: Connection }>();
    const router = new Router();

    const connectionOptions: ConnectionOptions = {
        type: "mysql" as "mysql",
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        "entities": [
            __dirname + "/Entity/**/*.ts"
        ],
        "migrations": [
            __dirname + "/Migrations/**/*.ts"
        ],
        "subscribers": [
            __dirname + "/Subscriber/**/*.ts"
        ],
        synchronize: true,
    };

    app.context.db = await createConnection(connectionOptions);

    type CustomContext = ExtendableContext
        & { state: any }
        & IRouterParamContext<any, {}>
        & {body: object, response: { body: object }}
        & { db: Connection }
    ;

    router.post("/users", async (ctx: CustomContext, next) => {
        const body =  ctx.request.body;

        const repository = ctx.db.getRepository(User);

        const user = new User();

        user.username = body.username;
        user.firstName = body.firstName;
        user.lastName = body.lastName;

        await repository.save(user);

        ctx.status = 201;

        await next();
    })

    router.get("/users", async (ctx: CustomContext, next) => {
        const repository = ctx.db.getRepository(User);

        const users = await repository.find();

        console.log(users);

        ctx.headers["content-type"] = 'application/json';

        ctx.response.body = users;

        ctx.status = 200;
    })

    router.get("/user/:username", async (ctx: CustomContext, next) => {
        const repository = ctx.db.getRepository(User);

        try {
            const user = await repository.findOneOrFail({username: ctx.params.username});

            ctx.body = user;
            ctx.status = 200;
        } catch (error) {
            ctx.status = 404;
        }

        next();
    })

    router.put("/user/:username", async (ctx: CustomContext, next) => {
        const repository = ctx.db.getRepository(User);

        try {

            const fields: {
                firstName?: string,
                lastName?: string
            } = {};

            const body = ctx.request.body;

            if ('firstName' in body) {
                fields.firstName = body.firstName;
            }

            if ('lastName' in body) {
                fields.lastName = body.lastName;
            }

            await repository.update(ctx.params.username, fields);

            ctx.status = 200;

        } catch (error) {
            ctx.status = 404;
        }

        next();
    })

    router.delete('/user/:username', async (ctx: CustomContext, next) => {
        const repository = ctx.db.getRepository(User);

        try {
            await repository.delete(ctx.params.username);
            ctx.status = 204;
        } catch (error) {
            ctx.status = 404;
        }

        next();
    })

    app.use(bodyParser({
        enableTypes: ['json']
    }));
    app.use(logger());

    app.use(router.routes()).use(router.allowedMethods());

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log("koa started\n")
        console.log(`Listening on port ${port}`)
    })
})();

