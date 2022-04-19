import "reflect-metadata";

import Koa from "koa";
import Router from "koa-router";
import Subdomain from "koa-subdomain";

import logger from "koa-logger";
import bodyParser from "koa-bodyparser";

import { Connection } from "typeorm";
import { config } from "dotenv";

import * as Api from './Api/index.js';
import * as Accounts from './Accounts/index.js';
import { connection } from "./Connection.js";

config({
    path: __dirname + "/.env"
});

const app = new Koa<any, { db: Connection, getAuth: () => string|null }>();
const apiRouter = new Router();
const accountsRouter = new Router();
const subdomain = new Subdomain();


app.subdomainOffset = +process.env.SUBDOMAIN_OFFSET;

app.context.db = connection;

app.context.getAuth = function <T = null>(returnValue: T = null): T|string {
    if (!('authorization' in this.headers)) {
        return returnValue;
    }
    const authorization: string[] = this.headers['authorization'].split(' ');

    if (authorization.length < 2) {
        return returnValue;
    }

    if (authorization[0].toLowerCase() !== 'bearer') {
        return returnValue;
    }

    return authorization[1];
}

apiRouter.use(...Api.beforeRoutesMiddlewares);
accountsRouter.use(...Accounts.beforeRoutesMiddlewares);

for (const apiRoute of Api.routes) {
    if (apiRoute.name !== undefined) {
        apiRouter[apiRoute.method](apiRoute.name, apiRoute.path, apiRoute.middleware);
        continue;
    }
    apiRouter[apiRoute.method](apiRoute.path, apiRoute.middleware);
}

for (const accountsRoute of Accounts.routes) {
    if (accountsRoute.name !== undefined) {
        apiRouter[accountsRoute.method](accountsRoute.name, accountsRoute.path, accountsRoute.middleware);
        continue;
    }
    apiRouter[accountsRoute.method](accountsRoute.path, accountsRoute.middleware);
}

apiRouter.use(...Api.afterRoutesMiddlewares);
accountsRouter.use(...Accounts.afterRoutesMiddlewares);

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
});

