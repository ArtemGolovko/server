import { Next } from "koa";
import { Connection } from "typeorm";
import { Hashtag } from "../Entity/Hashtag";
import { Post } from "../Entity/Post";
import { User } from "../Entity/User";
import type { AppContext } from "../Type";

const formatPost = (post: Post) => ({
    id: post.id,
    author: {
        username: post.author.username,
        name: post.author.name
    },
    date: post.date.getTime(),
    dateDiff: "null",
    dateUpdated: post.dateUpdated?.getTime(),
    dateUpdatedDiff: "null",
    text: post.text,
    hastags: post.hashtags.map(hashtag => hashtag.name),
    profileMarks: post.markedUsers.map(user => user.username),
    images: post.images,
    likes: post.likesCount
})

const getHashtags = async (db: Connection, names: string[]): Promise<Hashtag[]> => {
    const repository = db.getRepository(Hashtag);

    const hastags = await repository.findByIds(names);

    const foundHashtags = hastags.map(hashtag => hashtag.name);

    const newHashtags = names.filter(hashtag => !foundHashtags.includes(hashtag));

    for (const newHashtag of newHashtags) {
        const hashtag = new Hashtag();
        hashtag.name = newHashtag;
        await repository.save(hashtag);
        hastags.push(hashtag);
    }

    return hastags;
}

const createPost = async (ctx: AppContext, next: Next) => {
    const body = ctx.request.body;

    if (!('text' in  body)) {
        ctx.status = 400;
        await next();
        return;
    }

    const repository = ctx.db.getRepository(Post);

    const loggedUserUsername = ctx.getAuth();

    if (loggedUserUsername === null) {
        ctx.status = 401;
        await next();
        return;
    }

    try {
        const userRepository = ctx.db.getRepository(User);

        const user = await userRepository.findOneOrFail(loggedUserUsername);
        const post = new Post();

        post.author = user;
        post.date = new Date();
        post.hashtags = await getHashtags(ctx.db, body.hastags ?? []);
        post.markedUsers = await ctx.db.getRepository(User).findByIds(body.profileMarks ?? []);
        post.images = body.images ?? [];
        post.text = body.text;

        await repository.save(post);
        ctx.status = 201;
    } catch (error) {
        ctx.status = 401;
    }

    await next();
}

const getPosts = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);
    const posts: Post[] = await repository
        .createQueryBuilder('post')
        .leftJoin('post.likes', 'likes')
        .leftJoinAndMapOne('post.author', 'post.author', 'author')
        .leftJoinAndMapMany('post.hashtags', 'post.hashtags', 'hastags')
        .leftJoinAndMapMany('post.markedUsers', 'post.markedUsers', 'markedUsers')
        .loadRelationCountAndMap('post.likesCount', 'post.likes')
        .getMany();

    ctx.body = posts.map(formatPost);
    ctx.status = 200;
    
    await next();
}

const getPost = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);
    try {
        const post: Post = await repository
            .createQueryBuilder('post')
            .where('post.id = :id', { id: ctx.params.id })
            .leftJoin('post.likes', 'likes')
            .leftJoinAndMapOne('post.author', 'post.author', 'author')
            .leftJoinAndMapMany('post.hashtags', 'post.hashtags', 'hastags')
            .leftJoinAndMapMany('post.markedUsers', 'post.markedUsers', 'markedUsers')
            .loadRelationCountAndMap('post.likesCount', 'post.likes')
            .getOneOrFail();
        
        ctx.body = formatPost(post);
        ctx.status = 200;
    } catch (error) {
        ctx.status = 404;
    }
    await next();
}

const updatePost = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);

    const loggedUserUsername = ctx.getAuth();

    if (loggedUserUsername === null) {
        ctx.status = 401;
        await next();
        return;
    }

    try {
        const post = await repository
            .createQueryBuilder('post')
            .where('post.id = :id', { id: ctx.params.id })
            .leftJoinAndMapOne('post.author', 'post.author', 'author')
            .getOneOrFail();

        if (post.author.username !== loggedUserUsername) throw 403;

        const fields: {
            text?: string,
            hashtags?: Hashtag[],
            markedUsers?: User[],
            images?: string[],
            dateUpdated?: Date
        } = {};

        const body = ctx.request.body;

        if (JSON.stringify(body) === JSON.stringify({})) throw 400; 

        if ('text' in body) {
            fields.text = body.text;
            fields.dateUpdated = new Date();
        }

        if ('hastags' in body) {
            fields.hashtags = await getHashtags(ctx.db, body.hastags);
            if (fields.dateUpdated === undefined) fields.dateUpdated = new Date();
        }

        if ('profileMarks' in body) {
            fields.markedUsers = await ctx.db.getRepository(User).findByIds(body.profileMarks);
            if (fields.dateUpdated === undefined) fields.dateUpdated = new Date();
        }

        if ('images' in body) {
            fields.images = body.images;
            if (fields.dateUpdated === undefined) fields.dateUpdated = new Date();
        }

        await repository.save({...post, ...fields});
        ctx.status = 200;
    } catch (error) {
        console.log(error);
        if (typeof error === 'number') {
            ctx.status = error;
        } else {
            ctx.status = 404;
        }
    }

    await next();
}

const likePost = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);

    const loggedUserUsername = ctx.getAuth();

    if (loggedUserUsername === null) {
        ctx.status = 401;
        await next();
        return;
    }

    try {
        const post = await repository.findOneOrFail(ctx.params.id);
        const loggedUser = await ctx.db.getRepository(User).findOneOrFail(loggedUserUsername);

        post.addLike(loggedUser);

        await repository.save(post);
        ctx.status = 200;
    } catch (error) {
        ctx.status = 404;
    }

    await next();
}

const unlikePost = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);

    const loggedUserUsername = ctx.getAuth();

    if (loggedUserUsername === null) {
        ctx.status = 401;
        await next();
        return;
    }

    try {
        const post = await repository.findOneOrFail(ctx.params.id);
        const loggedUser = await ctx.db.getRepository(User).findOneOrFail(loggedUserUsername);

        post.removeLike(loggedUser);

        await repository.save(post);
        ctx.status = 200;
    } catch (error) {
        ctx.status = 404;
    }

    await next();
}

const deletePost = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(Post);

    const loggedUserUsername = ctx.getAuth();

    if (loggedUserUsername === null) {
        ctx.status = 401;
        await next();
        return;
    }

    try {
        const post = await repository
            .createQueryBuilder('post')
            .where('post.id = :id', { id: ctx.params.id })
            .leftJoinAndMapOne('post.author', 'post.author', 'author')
            .getOneOrFail();

        if (post.author.username !== loggedUserUsername) throw 403;

        await repository.delete(ctx.params.id);
        ctx.status = 204;
    } catch (error) {
        if (typeof error === 'number') {
            ctx.status = error;
        } else {
            ctx.status = 404;
        }
    }

    await next();
}

export {
    createPost,
    getPosts,
    getPost,
    updatePost,
    likePost,
    unlikePost,
    deletePost
};