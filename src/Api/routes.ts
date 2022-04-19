import type { Route } from "../Type/index.js";
import { createComment, deleteComment, getComment, getComments, likeComment, unlikeComment, updateComment } from "./CommentMiddlewares.js";
import { UserController } from "./Controller/UserController.js";
import { getHashtag, getHashtags } from "./HashtagMiddlewares.js";
import { createPost, deletePost, getHashtagPosts, getPost, getPosts, getUserPosts, likePost, unlikePost, updatePost } from "./PostMiddlewares.js";
import { createReply, deleteReply, getReplies, getReply, likeReply, unlikeReply, updateReply } from "./ReplyMiddlewares.js";
// import { createUser, deleteUser, getUser, getUsers, subscribeUser, unsubscribeUser, updateUser } from "./UserMiddlewares";

const userController = new UserController();

const routes: Route[] = [
    //user group
    // { path: "/users", method: "get", middleware: getUsers },
    { path: "/users", method: "post", middleware: userController.createUserMiddleware },
    // { path: "/user/:username", method: "get", middleware: getUser },
    // { path: "/user/:username", method: "put", middleware: updateUser },
    // { path: "/user/:username/subscribe", method: "post", middleware: subscribeUser },
    // { path: "/user/:username/unsubscribe", method: "post", middleware: unsubscribeUser },
    // { path: "/user/:username", method: "delete", middleware: deleteUser },
    { path: "/user/:username/posts", method: "get", middleware: getUserPosts },
    // post group
    { path: "/posts", method: "get", middleware: getPosts },
    { path: "/posts", method: "post", middleware: createPost },
    { path: "/post/:id", method: "get", middleware: getPost },
    { path: "/post/:id", method: "put", middleware: updatePost },
    { path: "/post/:id/like", method: "post", middleware: likePost },
    { path: "/post/:id/unlike", method: "post", middleware: unlikePost },
    { path: "/post/:id", method: "delete", middleware: deletePost },
    // comment group
    { path: "/post/:postId/comments", method: "get", middleware: getComments },
    { path: "/post/:postId/comments", method: "post", middleware: createComment },
    { path: "/comment/:id", method: "get", middleware: getComment },
    { path: "/comment/:id", method: "put", middleware: updateComment },
    { path: "/comment/:id/like", method: "post", middleware: likeComment },
    { path: "/comment/:id/unlike", method: "post", middleware: unlikeComment },
    { path: "/comment/:id", method: "delete", middleware: deleteComment },
    // reply group
    { path: "/comment/:commentId/replies", method: "get", middleware: getReplies },
    { path: "/comment/:commentId/replies", method: "post", middleware: createReply },
    { path: "/reply/:id", method: "get", middleware: getReply },
    { path: "/reply/:id", method: "put", middleware: updateReply },
    { path: "/reply/:id/like", method: "post", middleware: likeReply },
    { path: "/reply/:id/unlike", method: "post", middleware: unlikeReply },
    { path: "/reply/:id", method: "delete", middleware: deleteReply },
    // hashtag group
    { path: "/hashtags", method: "get", middleware: getHashtags },
    { path: "/hashtag/:id", method: "get", middleware: getHashtag },
    { path: "/hashtag/:id/posts", method: "get", middleware: getHashtagPosts }
];

export default routes;