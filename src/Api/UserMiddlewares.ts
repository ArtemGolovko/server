import type { AppContext } from "../Type";
import type { Next } from "koa";
import { User } from "../Entity/User";

const formatUser = (user: User) => ({
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    profileBanner: user.profileBanner,
    isPrivate: user.isPrivate,
    subscribers: user.subscribersCount,
    subs: user.subscribedCount
});

const createUser = async (ctx: AppContext, next: Next) => {
    const body =  ctx.request.body;

    const repository = ctx.db.getRepository(User);

    const user = new User();

    user.username = body.username;
    user.name = body.name;
    user.profileBanner = body.profileBanner;
    user.avatar = body.avatar;

    if ('isPrivate' in body) {
        user.isPrivate = body.isPrivate;
    }

    await repository.save(user);

    ctx.status = 201;

    await next();
}

const getUsers = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(User);

    const users: User[] = await repository
        .createQueryBuilder('user')
        .leftJoin('user.subscribers', 'subscribers')
        .leftJoin('user.subscribed', 'subscribed')
        .loadRelationCountAndMap('user.subscribersCount', 'user.subscribers')
        .loadRelationCountAndMap('user.subscribedCount', 'user.subscribed')
        .getMany();

    ctx.headers["content-type"] = 'application/json';

    ctx.response.body = users.map(formatUser);

    ctx.status = 200;
    await next()
}

const getUser = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(User);

    try {
        const user = await repository
            .createQueryBuilder('user')
            .where('user.username = :username', { username: ctx.params.username })
            .leftJoin('user.subscribers', 'subscribers')
            .leftJoin('user.subscribed', 'subscribed')
            .loadRelationCountAndMap('user.subscribersCount', 'user.subscribers')
            .loadRelationCountAndMap('user.subscribedCount', 'user.subscribed')
            .getOneOrFail();

        ctx.body = formatUser(user);
        ctx.status = 200;
    } catch (error) {
        ctx.status = 404;
    }

    await next();
}

const updateUser = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(User);

    try {

        const fields: {
            name?: string,
            avatar?: string,
            profileBanner?: string,
            isPrivate?: boolean
        } = {};

        const body = ctx.request.body;

        if ('name' in body) {
            fields.name = body.name;
        }

        if ('avatar' in body) {
            fields.avatar = body.avatar;
        }

        if ('profileBanner' in body) {
            fields.profileBanner = body.profileBanner;
        }

        if ('isPrivate' in body) {
            fields.isPrivate = body.isPrivate;
        }

        await repository.update(ctx.params.username, fields);

        ctx.status = 200;

    } catch (error) {
        ctx.status = 404;
    }

    await next();
}

const subscribeUser = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(User);

    const loggedUserUsername = ctx.getAuth()

    if (loggedUserUsername === null) {
        ctx.status = 401;
        await next();
        return;
    }

    try {
        const user = await repository.findOneOrFail(ctx.params.username);
        const loggedUser = await repository.findOneOrFail(loggedUserUsername);

        user.addSubscriber(loggedUser);

        await repository.save(user);
        ctx.status = 200;
    } catch (error) {
        ctx.status = 404;
    }

    await next();
}

const unsubscribeUser = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(User);

    const loggedUserUsername = ctx.getAuth();

    if (loggedUserUsername === null) {
        ctx.status = 401;
        await next();
        return;
    }

    try {
        const user = await repository.findOneOrFail(ctx.params.username);
        const loggedUser = await repository.findOneOrFail(loggedUserUsername);

        user.removeSubscriber(loggedUser);

        await repository.save(user);
        ctx.status = 200;
    } catch (error) {
        ctx.status = 404;
    }

    await next();
}

const deleteUser = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(User);

    try {
        await repository.delete(ctx.params.username);
        ctx.status = 204;
    } catch (error) {
        ctx.status = 404;
    }

    await next();
}

export {
    createUser, 
    getUsers,
    getUser,
    updateUser,
    subscribeUser,
    unsubscribeUser,
    deleteUser
};