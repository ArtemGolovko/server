import { Next } from "koa";
import { Hashtag } from "../Entity/Hashtag.js";
import type { AppContext } from "../Type/index.js";
import { createHttpError, handleError } from "./Error/index.js";

const formatHashtag = (hashtag: Hashtag) => ({
    id: hashtag.id,
    name: hashtag.name,
    posts: hashtag.associatedPostsCount
})

export const getHashtags = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Hashtag);

    const hashtags = await repository
        .createQueryBuilder('hashtag')
        .loadRelationCountAndMap('hashtag.associatedPostsCount', 'hashtag.associatedPosts')
        .getMany();

    ctx.body = hashtags.map(formatHashtag);
    ctx.status = 200;

    await next();
}

export const getHashtag = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Hashtag);

    try {
        const hashtag = await repository
            .createQueryBuilder('hashtag')
            .loadRelationCountAndMap('hashtag.associatedPostsCount', 'hashtag.associatedPosts')
            .where('hashtag.id = :id', { id: ctx.params.id })
            .getOneOrFail().catch(() => createHttpError(404));

        ctx.body = formatHashtag(hashtag);
        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }
    await next();
}