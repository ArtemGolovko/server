import { Next } from "koa";
import { Comment } from "../Entity/Comment.js";
import { Reply } from "../Entity/Reply.js";
import { User } from "../Entity/User.js";
import { AppContext } from "../Type/index.js";
import { createBadRequestError, createHttpError, handleError } from "./Error/index.js";
import { validateCreate, validateUpdate } from "./Validator/ReplyValidator.js";


const formatReply = (reply: Reply) => {
    const output = {
        id: reply.id,
        text: reply.text,
        author: {
            username: reply.author.username,
            name: reply.author.name
        },
        likes: reply.likesCount
    };

    if (reply.to === null) return output;

    const replyTo = {
        username: reply.to.username,
        name: reply.to.name 
    };

    return { ...output, replyTo };
}

export const createReply = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Reply);
    const userRepository = ctx.db.getRepository(User);
    const commentRepository = ctx.db.getRepository(Comment);

    try {
        const loggedUser = await userRepository.findOneOrFail(ctx.getAuth('')).catch(() => createHttpError(401));
        const comment = await commentRepository.findOneOrFail(ctx.params.commentId).catch(() => createHttpError(404));

        const body = ctx.request.body;
        validateCreate(body);

        const relpy = repository.create({
            text: body.text,
            comment: comment,
            author: loggedUser
        });

        if ('replyTo' in body) {
            const userFor = await userRepository.findOneOrFail(body.replyTo).catch(() => createBadRequestError(1));
            relpy.to = userFor;
        }

        await repository.save(relpy);

        ctx.status = 201;
    } catch (error) {
        const { status, body } = handleError(error);
        ctx.status = status;
        ctx.body = body;
    }
    await next();
}


export const getReplies = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Reply);
    const commentRepository = ctx.db.getRepository(Comment);

    try {
        await commentRepository.findOneOrFail(ctx.params.commentId).catch(() => createHttpError(404));

        const replies = await repository
            .createQueryBuilder('reply')
            .leftJoinAndMapOne('reply.author', 'reply.author', 'author')
            .leftJoinAndMapOne('reply.to', 'reply.to', 'to')
            .loadRelationCountAndMap('reply.likesCount', 'reply.likes')
            .leftJoin('reply.comment', 'comment')
            .where('comment.id = :commentId', { commentId: ctx.params.commentId })
            .getMany();

        ctx.body = replies.map(formatReply);
        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}

export const getReply = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Reply);

    try {
        const reply = await repository
            .createQueryBuilder('reply')
            .leftJoinAndMapOne('reply.author', 'reply.author', 'author')
            .leftJoinAndMapOne('reply.to', 'reply.to', 'to')
            .loadRelationCountAndMap('reply.likesCount', 'reply.likes')
            .where('reply.id = :id', { id: ctx.params.id })
            .getOneOrFail().catch(() => createHttpError(404));

        ctx.body = formatReply(reply);
        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}


export const updateReply = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Reply);

    try {
        const loggedUserUsername = ctx.getAuth();
        if (loggedUserUsername === null) createHttpError(401);

        const relpy = await repository
            .createQueryBuilder('reply')
            .leftJoinAndMapOne('reply.author', 'reply.author', 'author')
            .where('reply.id = :id', { id: ctx.params.id })
            .getOneOrFail().catch(() => createHttpError(404));

        if (relpy.author.username !== loggedUserUsername) createHttpError(403);

        const body = ctx.request.body;
        validateUpdate(body);

        relpy.text = body.text;

        await repository.save(relpy);

        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}

export const likeReply = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Reply);
    const userRepository = ctx.db.getRepository(User);

    try {
        const loggedUser = await userRepository.findOneOrFail(ctx.getAuth('')).catch(() => createHttpError(401));
        const relpy = await repository.findOneOrFail(ctx.params.id).catch(() => createHttpError(404));

        relpy.addLike(loggedUser);
        await repository.save(relpy);

        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}

export const unlikeReply = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Reply);
    const userRepository = ctx.db.getRepository(User);

    try {
        const loggedUser = await userRepository.findOneOrFail(ctx.getAuth('')).catch(() => createHttpError(401));
        const relpy = await repository.findOneOrFail(ctx.params.id).catch(() => createHttpError(404));

        relpy.removeLike(loggedUser);
        await repository.save(relpy);

        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}

export const deleteReply = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Reply);

    try {
        const loggedUserUseranme = ctx.getAuth();
        if (loggedUserUseranme === null) createHttpError(401);

        const reply = await repository
            .createQueryBuilder('reply')
            .leftJoinAndMapOne('reply.author', 'reply.author', 'author')
            .where('reply.id = :id', { id: ctx.params.id })
            .getOneOrFail().catch(() => createHttpError(404));

        if (reply.author.username !== loggedUserUseranme) createHttpError(403);

        await repository.delete(reply);
        ctx.status = 204;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}