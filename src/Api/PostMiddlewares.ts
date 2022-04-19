import { Next } from "koa";
import { Connection } from "typeorm";
import { Hashtag } from "../Entity/Hashtag.js";
import { Post } from "../Entity/Post.js";
import { User } from "../Entity/User.js";
import type { AppContext } from "../Type/index.js";
import moment from 'moment';
import { validateCreate, validateUpdate } from "./Validator/PostValidator.js";
import { createForbiddenError, createHttpError, handleError } from "./Error/index.js";

const formatPost = (post: Post) => ({
    id: post.id,
    author: {
        username: post.author.username,
        name: post.author.name
    },
    date: post.date.getTime(),
    dateDiff: moment(post.date.getTime()).locale('ru').fromNow(),
    dateUpdated: post.dateUpdated?.getTime(),
    dateUpdatedDiff: (post.dateUpdated !== null) ? moment(post.dateUpdated.getTime()).locale('ru').fromNow() : undefined,
    text: post.text,
    hashtags: post.hashtags.map(hashtag => hashtag.name),
    profileMarks: post.markedUsers.map(user => user.username),
    images: post.images,
    likes: post.likesCount
})

export const getHashtags = async (db: Connection, names: string[]): Promise<Hashtag[]> => {
    const repository = db.getRepository(Hashtag);

    const hashtags = await repository.findByIds(names);

    const foundHashtags = hashtags.map(hashtag => hashtag.name);

    const newHashtags = names.filter(hashtag => !foundHashtags.includes(hashtag));

    for (const newHashtag of newHashtags) {
        const hashtag = repository.create({
            name: newHashtag
        });

        await repository.save(hashtag);
        hashtags.push(hashtag);
    }

    return hashtags;
}

export const createPost = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);
    const userRepository = ctx.db.getRepository(User);

    try {
        const user = await userRepository.findOneOrFail(ctx.getAuth('')).catch(() => createHttpError(401));

        const body = ctx.request.body;
        validateCreate(body);

        const post = repository.create({
            author: user,
            date: new Date(),
            hashtags: await getHashtags(ctx.db, body.hashtags ?? []),
            markedUsers: await ctx.db.getRepository(User).findByIds(body.profileMarks ?? []),
            images: body.images ?? [],
            text: body.text
        });

        await repository.save(post);
        ctx.status = 201;
    } catch (error) {
        const { status, body } = handleError(error);
        ctx.status = status;
        ctx.body = body;
    }

    await next();
}

export const getPosts = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);
    const posts: Post[] = await repository
        .createQueryBuilder('post')
        .leftJoin('post.likes', 'likes')
        .leftJoinAndMapOne('post.author', 'post.author', 'author')
        .leftJoinAndMapMany('post.hashtags', 'post.hashtags', 'hashtags')
        .leftJoinAndMapMany('post.markedUsers', 'post.markedUsers', 'markedUsers')
        .loadRelationCountAndMap('post.likesCount', 'post.likes')
        .getMany();

    ctx.body = posts.map(formatPost);
    ctx.status = 200;
    
    await next();
}

export const getPost = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);
    try {
        const post: Post = await repository
            .createQueryBuilder('post')
            .where('post.id = :id', { id: ctx.params.id })
            .leftJoin('post.likes', 'likes')
            .leftJoinAndMapOne('post.author', 'post.author', 'author')
            .leftJoinAndMapMany('post.hashtags', 'post.hashtags', 'hashtags')
            .leftJoinAndMapMany('post.markedUsers', 'post.markedUsers', 'markedUsers')
            .loadRelationCountAndMap('post.likesCount', 'post.likes')
            .getOneOrFail().catch(() => createHttpError(404));
        
        ctx.body = formatPost(post);
        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }
    await next();
}

export const updatePost = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);

    try {
        const loggedUserUsername = ctx.getAuth();
        if (loggedUserUsername === null) createHttpError(401);
        
        const post = await repository
            .createQueryBuilder('post')
            .where('post.id = :id', { id: ctx.params.id })
            .leftJoinAndMapOne('post.author', 'post.author', 'author')
            .getOneOrFail().catch(() => createHttpError(404));

        if (post.author.username !== loggedUserUsername) createForbiddenError();

        const body = ctx.request.body;
        validateUpdate(body);

        const fields: {
            text?: string,
            hashtags?: Hashtag[],
            markedUsers?: User[],
            images?: string[],
            dateUpdated: Date
        } = {
            dateUpdated: new Date()
        };

        if ('text' in body) {
            fields.text = body.text;
        }

        if ('hashtags' in body) {
            fields.hashtags = await getHashtags(ctx.db, body.hashtags);
        }

        if ('profileMarks' in body) {
            fields.markedUsers = await ctx.db.getRepository(User).findByIds(body.profileMarks);
        }

        if ('images' in body) {
            fields.images = body.images;
        }

        await repository.save({...post, ...fields});
        ctx.status = 200;
    } catch (error) {
        const { status, body } = handleError(error);
        ctx.status = status;
        ctx.body = body;
    }

    await next();
}

export const likePost = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);

    try {
        const post = await repository.findOneOrFail(ctx.params.id).catch(() => createHttpError(404));
        const userRepository = ctx.db.getRepository(User);
        const loggedUser = await userRepository.findOneOrFail(ctx.getAuth('')).catch(() => createHttpError(401));

        post.addLike(loggedUser);

        await repository.save(post);
        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}

export const unlikePost = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);

    try {
        const post = await repository.findOneOrFail(ctx.params.id).catch(() => createHttpError(404));
        const userRepository = ctx.db.getRepository(User);
        const loggedUser = await userRepository.findOneOrFail(ctx.getAuth('')).catch(() => createHttpError(401));

        post.removeLike(loggedUser);

        await repository.save(post);
        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}

export const deletePost = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);

    const loggedUserUsername = ctx.getAuth();

    try {
        if (loggedUserUsername === null) createHttpError(401);
        const post = await repository
            .createQueryBuilder('post')
            .where('post.id = :id', { id: ctx.params.id })
            .leftJoinAndMapOne('post.author', 'post.author', 'author')
            .getOneOrFail().catch(() => createHttpError(404));

        if (post.author.username !== loggedUserUsername) createHttpError(403);

        await repository.delete(ctx.params.id);
        ctx.status = 204;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}

export const getUserPosts = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);

    try {
        await ctx.db.getRepository(User).findOneOrFail(ctx.params.username).catch(() => createHttpError(404));

        const posts = await repository.createQueryBuilder('post')
            .leftJoin('post.likes', 'likes')
            .leftJoinAndMapOne('post.author', 'post.author', 'author')
            .leftJoinAndMapMany('post.hashtags', 'post.hashtags', 'hashtags')
            .leftJoinAndMapMany('post.markedUsers', 'post.markedUsers', 'markedUsers')
            .where('author.username = :username', { username: ctx.params.username })
            .loadRelationCountAndMap('post.likesCount', 'post.likes')
            .getMany();

        ctx.body = posts.map(formatPost);
        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}

export const getHashtagPosts = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);

    try {
        await ctx.db.getRepository(Hashtag).findOneOrFail(ctx.params.id).catch(() => createHttpError(404));

        const posts = await repository.createQueryBuilder('post')
            .leftJoin('post.likes', 'likes')
            .leftJoinAndMapOne('post.author', 'post.author', 'author')
            .leftJoinAndMapMany('post.hashtags', 'post.hashtags', 'hashtags')
            .leftJoinAndMapMany('post.markedUsers', 'post.markedUsers', 'markedUsers')
            .where('hashtags.id = :id', { id: ctx.params.id })
            .loadRelationCountAndMap('post.likesCount', 'post.likes')
            .getMany();

        ctx.body = posts.map(formatPost);
        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}