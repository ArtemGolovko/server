import { Middleware } from "../Type/index.js";
import routes from "./routes.js";

const beforeRoutesMiddlewares: Middleware[] = [];
const afterRoutesMiddlewares: Middleware[] = [];

export { routes, beforeRoutesMiddlewares, afterRoutesMiddlewares };