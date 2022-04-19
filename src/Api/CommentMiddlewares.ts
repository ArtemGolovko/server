import { Next } from "koa";
import { Comment } from "../Entity/Comment.js";
import { Post } from "../Entity/Post.js";
import { User } from "../Entity/User.js";
import { AppContext } from "../Type/index.js";
import { createHttpError, handleError } from "./Error/index.js";
import { validateCreate, validateUpdate } from "./Validator/CommentValidator.js";

const formatComment = (comment: Comment) => ({
    id: comment.id,
    text: comment.text,
    author: {
        username: comment.author.username,
        name: comment.author.name
    },
    likes: comment.likesCount
})

export const createComment = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Comment);
    const userRepository = ctx.db.getRepository(User);
    const postRepostiory = ctx.db.getRepository(Post);

    try {
        const loggedUser = await userRepository.findOneOrFail(ctx.getAuth('')).catch(() => createHttpError(401));
        const post = await postRepostiory.findOneOrFail(ctx.params.postId).catch(() => createHttpError(404));

        const body = ctx.request.body;

        validateCreate(body);

        const comment = repository.create({ 
            author: loggedUser,
            text: body.text,
            post: post
        });

        await repository.save(comment);
        ctx.status = 201;

    } catch(error) {
        const { status } = handleError(error);
        ctx.status = status; 
    }
    await next();
}

export const getComments = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Comment);
    const postRepository = ctx.db.getRepository(Post);

    try {
        await postRepository.findOneOrFail(ctx.params.postId).catch(() => createHttpError(404));

        const comments = await repository
            .createQueryBuilder('comment')
            .leftJoinAndMapOne('comment.post', 'comment.post', 'post')
            .leftJoinAndMapOne('comment.author', 'comment.author', 'author')
            .loadRelationCountAndMap('comment.likesCount', 'comment.likes')
            .where('post.id = :postId', { postId: ctx.params.postId })
            .getMany();
        
        ctx.body = comments.map(formatComment);
        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}

export const getComment = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Comment);

    try {
        const comment = await repository
            .createQueryBuilder('comment')
            .leftJoinAndMapOne('comment.post', 'comment.post', 'post')
            .leftJoinAndMapOne('comment.author', 'comment.author', 'author')
            .loadRelationCountAndMap('comment.likesCount', 'comment.likes')
            .where('comment.id = :id', { id: ctx.params.id })
            .getOneOrFail().catch(() => createHttpError(404));
        
        ctx.body = formatComment(comment);
        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}
export const updateComment = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Comment);

    try {
        const loggedUserUsername = ctx.getAuth();
        if (loggedUserUsername === null) createHttpError(401);
        // const userRepository = ctx.db.getRepository(User);
        // await userRepository.findOneOrFail(loggedUserUsername).catch(() => createHttpError(401));

        const comment = await repository
            .createQueryBuilder('comment')
            .leftJoinAndMapOne('comment.author', 'comment.author', 'author')
            .where('comment.id = :id', { id: ctx.params.id })
            .getOneOrFail().catch(() => createHttpError(404));

        if (comment.author.username !== loggedUserUsername) createHttpError(403);

        const body = ctx.request.body;
        validateUpdate(body);

        comment.text = body.text;

        await repository.save(comment);
        ctx.status = 200;
    } catch(error) {
        const { status } = handleError(error);
        ctx.status = status;
    }
    await next();
}

export const likeComment = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Comment);

    try {
        const comment = await repository.findOneOrFail(ctx.params.id).catch(() => createHttpError(404));
        const userRepository = ctx.db.getRepository(User);
        const loggedUser = await userRepository.findOneOrFail(ctx.getAuth('')).catch(() => createHttpError(401));
        
        comment.addLike(loggedUser);

        await repository.save(comment);
        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}

export const unlikeComment = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Comment);

    try {
        const comment = await repository.findOneOrFail(ctx.params.id).catch(() => createHttpError(404));
        const userRepository = ctx.db.getRepository(User);
        const loggedUser = await userRepository.findOneOrFail(ctx.getAuth('')).catch(() => createHttpError(401));
        
        comment.removeLike(loggedUser);

        await repository.save(comment);
        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }
    
    await next();
}

export const deleteComment = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Comment);

    const loggedUserUsername = ctx.getAuth();
    
    try {
        if (loggedUserUsername === null) createHttpError(401);

        const comment = await repository
            .createQueryBuilder('comment')
            .where('comment.id = :id', { id: ctx.params.id })
            .leftJoinAndMapOne('comment.author', 'comment.author', 'author')
            .getOneOrFail().catch(() => createHttpError(404));
        
        if (comment.author.username !== loggedUserUsername) createHttpError(403);

        await repository.delete(comment);
        ctx.status = 204;
    } catch(error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}