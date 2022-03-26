import "reflect-metadata";

import * as Koa from "koa";
import * as Router from "koa-router";
import * as Subdomain from "koa-subdomain";

import * as logger from "koa-logger";
import * as bodyParser from "koa-bodyparser";

import { Connection, ConnectionOptions, createConnection } from "typeorm";
import { config } from "dotenv";

import apiRoutes from "./Api/routes";
import accountsRoutes from "./Accounts/routes";

config({
    path: __dirname + "/.env"
});

(async () => {
    const app = new Koa<any, { db: Connection, getAuth: () => string|null }>();
    const apiRouter = new Router();
    const accountsRouter = new Router();
    const subdomain = new Subdomain();
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

    app.subdomainOffset = +process.env.SUBDOMAIN_OFFSET;

    app.context.db = await createConnection(connectionOptions);

    app.context.getAuth = function () {
        if (!('authorization' in this.headers)) {
            return null;
        }
        const authorization: string[] = this.headers['authorization'].split(' ');

        if (authorization.length < 2) {
            return null;
        }

        if (authorization[0].toLowerCase() !== 'bearer') {
            return null;
        }

        return authorization[1];
    }
    

    for (const apiRoute of apiRoutes) {
        if (apiRoute.name !== undefined) {
            apiRouter[apiRoute.method](apiRoute.name, apiRoute.path, apiRoute.middleware);
            continue;
        }
        apiRouter[apiRoute.method](apiRoute.path, apiRoute.middleware);
    }

    for (const accountsRoute of accountsRoutes) {
        if (accountsRoute.name !== undefined) {
            apiRouter[accountsRoute.method](accountsRoute.name, accountsRoute.path, accountsRoute.middleware);
            continue;
        }
        apiRouter[accountsRoute.method](accountsRoute.path, accountsRoute.middleware);
    }


    subdomain.use('api', apiRouter.routes())
    subdomain.use('accounts', accountsRouter.routes())

    app.use(bodyParser({
        enableTypes: ['json']
    }));

    app.use(logger());

    app.use(subdomain.routes());

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log("koa started\n")
        console.log(`Listening on port ${port}`)
    })
})();

