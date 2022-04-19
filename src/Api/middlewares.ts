import { Middleware } from "../Type/index.js";
import { CORSandCSP } from "./browserSecurity.js";

const beforeRoutesMiddlewares: Middleware[] = [
    CORSandCSP
];

const afterRoutesMiddlewares: Middleware[] = [];

export { beforeRoutesMiddlewares, afterRoutesMiddlewares };