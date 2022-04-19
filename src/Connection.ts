import { config } from "dotenv";
import { ConnectionOptions, createConnection } from "typeorm";

config({
    path: __dirname + "/.env"
});

const connectionOptions: ConnectionOptions = {
    type: "mysql" as "mysql",
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
        __dirname + "/Entity/**/*.ts"
    ],
    migrations: [
        __dirname + "/Migrations/**/*.ts"
    ],
    subscribers: [
        __dirname + "/Subscriber/**/*.ts"
    ],
    synchronize: true,
};

export const connection = await createConnection(connectionOptions);