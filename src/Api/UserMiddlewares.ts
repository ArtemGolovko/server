/*
import type { AppContext } from "../Type";
import type { Next } from "koa";
import { User } from "../Entity/User";
import { validateCreate, validateUpdate } from "./Validator/UserValidator";
import { createHttpError, createNotFoundError, createUnauthorizedError, handleError } from "./Error";

const formatUser = (user: User) => ({
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    profileBanner: user.profileBanner,
    isPrivate: user.isPrivate,
    subscribers: user.subscribersCount,
    subs: user.subscribedCount
});

export const createUser = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(User);

    const body =  ctx.request.body;

    try {
        validateCreate(body);

        const user = repository.create({
            username: body.username,
            name: body.name,
            profileBanner: body.profileBanner,
            avatar: body.avatar
        });

        if ('isPrivate' in body) {
            user.isPrivate = body.isPrivate;
        }

        await repository.save(user);

        ctx.status = 201;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}

export const getUsers = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(User);

    const users: User[] = await repository
        .createQueryBuilder('user')
        .leftJoin('user.subscribers', 'subscribers')
        .leftJoin('user.subscribed', 'subscribed')
        .loadRelationCountAndMap('user.subscribersCount', 'user.subscribers')
        .loadRelationCountAndMap('user.subscribedCount', 'user.subscribed')
        .getMany();

    ctx.response.body = users.map(formatUser);

    ctx.status = 200;
    await next()
}

export const getUser = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(User);

    try {
        const user = await repository
            .createQueryBuilder('user')
            .where('user.username = :username', { username: ctx.params.username })
            .leftJoin('user.subscribers', 'subscribers')
            .leftJoin('user.subscribed', 'subscribed')
            .loadRelationCountAndMap('user.subscribersCount', 'user.subscribers')
            .loadRelationCountAndMap('user.subscribedCount', 'user.subscribed')
            .getOneOrFail().catch(() => createNotFoundError('user', ctx.params.username));

        ctx.body = formatUser(user);
        ctx.status = 200;
    } catch (error) {
        const { status, body } = handleError(error);
        ctx.status = status;
        ctx.body = body;
    }

    await next();
}

export const updateUser = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(User);

    try {
        const body = ctx.request.body;
        validateUpdate(body);

        const fields: {
            name?: string,
            avatar?: string,
            profileBanner?: string,
            isPrivate?: boolean
        } = {};

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

        await repository.update(ctx.params.username, fields).catch(() => createHttpError(404));

        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}

export const subscribeUser = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(User);

    try {
        const loggedUserUsername = ctx.getAuth();
        if (loggedUserUsername === null) createUnauthorizedError(0);

        const user = await repository.findOneOrFail(ctx.params.username).catch(() => createHttpError(404));
        const loggedUser = await repository.findOneOrFail(loggedUserUsername)
            .catch(() => createUnauthorizedError(1));

        user.addSubscriber(loggedUser);

        await repository.save(user);
        ctx.status = 200;
    } catch (error) {
        const { status, body } = handleError(error);
        ctx.status = status;
        ctx.body = body;
    }

    await next();
}

export const unsubscribeUser = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(User);

    try {
        const user = await repository.findOneOrFail(ctx.params.username).catch(() => createHttpError(404));
        const loggedUser = await repository.findOneOrFail(ctx.getAuth('')).catch(() => createHttpError(401));

        user.removeSubscriber(loggedUser);

        await repository.save(user);
        ctx.status = 200;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}

export const deleteUser = async (ctx: AppContext, next: Next) => {
    const repository = ctx.db.getRepository(User);

    try {
        await repository.findOneOrFail(ctx.params.username).catch(() => createHttpError(404));
        await repository.delete(ctx.params.username);
        ctx.status = 204;
    } catch (error) {
        const { status } = handleError(error);
        ctx.status = status;
    }

    await next();
}*/