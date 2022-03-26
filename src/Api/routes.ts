import type { Route } from "../Type";
import { createPost, deletePost, getPost, getPosts, likePost, unlikePost, updatePost } from "./PostMiddlewares";
import { createUser, deleteUser, getUser, getUsers, subscribeUser, unsubscribeUser, updateUser } from "./UserMiddlewares";

const routes: Route[] = [
    //user group
    { path: "/users", method: "get", middleware: getUsers },
    { path: "/users", method: "post", middleware: createUser },
    { path: "/user/:username", method: "get", middleware: getUser },
    { path: "/user/:username", method: "put", middleware: updateUser },
    { path: "/user/:username/subscribe", method: "post", middleware: subscribeUser },
    { path: "/user/:username/unsubscribe", method: "post", middleware: unsubscribeUser },
    { path: "/user/:username", method: "delete", middleware: deleteUser },
    // post group
    { path: "/posts", method: "get", middleware: getPosts },
    { path: "/posts", method: "post", middleware: createPost },
    { path: "/post/:id", method: "get", middleware: getPost },
    { path: "/post/:id", method: "put", middleware: updatePost },
    { path: "/post/:id/like", method: "post", middleware: likePost },
    { path: "/post/:id/unlike", method: "post", middleware: unlikePost },
    { path: "/post/:id", method: "delete", middleware: deletePost }
];

export default routes;