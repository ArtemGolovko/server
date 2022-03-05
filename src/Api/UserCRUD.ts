import type {AppContext} from "../Type";
import {User} from "../Entity/User";

const createUser = async (ctx: AppContext, next) => {
    const body =  ctx.request.body;

    const repository = ctx.db.getRepository(User);

    const user = new User();

    user.username = body.username;
    user.firstName = body.firstName;
    user.lastName = body.lastName;

    await repository.save(user);

    ctx.status = 201;

    await next();
}

const getUsers = async (ctx: AppContext, next) => {
    const repository = ctx.db.getRepository(User);

    const users = await repository.find();

    console.log(users);

    ctx.headers["content-type"] = 'application/json';

    ctx.response.body = users;

    ctx.status = 200;
    await next()
}

const getUser = async (ctx: AppContext, next) => {
    const repository = ctx.db.getRepository(User);

    try {
        const user = await repository.findOneOrFail({username: ctx.params.username});

        ctx.body = user;
        ctx.status = 200;
    } catch (error) {
        ctx.status = 404;
    }

    next();
}

const updateUser = async (ctx: AppContext, next) => {
    const repository = ctx.db.getRepository(User);

    try {

        const fields: {
            firstName?: string,
            lastName?: string
        } = {};

        const body = ctx.request.body;

        if ('firstName' in body) {
            fields.firstName = body.firstName;
        }

        if ('lastName' in body) {
            fields.lastName = body.lastName;
        }

        await repository.update(ctx.params.username, fields);

        ctx.status = 200;

    } catch (error) {
        ctx.status = 404;
    }

    next();
}

const deleteUser = async (ctx: AppContext, next) => {
    const repository = ctx.db.getRepository(User);

    try {
        await repository.delete(ctx.params.username);
        ctx.status = 204;
    } catch (error) {
        ctx.status = 404;
    }

    next();
}

export { createUser, getUsers, getUser, updateUser, deleteUser };