import type { Route } from "../Type";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "./UserCRUD";

const routes: Route[] = [
    { path: "/users", method: "get", middleware: getUsers },
    { path: "/users", method: "post", middleware: createUser },
    { path: "/user/:username", method: "get", middleware: getUser },
    { path: "/user/:username", method: "put", middleware: updateUser },
    { path: "/user/:username", method: "delete", middleware: deleteUser }
];

export default routes;