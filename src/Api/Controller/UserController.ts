import { Repository } from "typeorm";
import { User } from "../../Entity/User.js";
import { AppContext } from "../../Type/index.js";
import { UserValidator } from "../Validator/UserValidator.js";
import { AbstractConteroller } from "./AbstractController.js";

export class UserController extends AbstractConteroller {
    private repository: Repository<User> = this.connection.getRepository(User);
    public createUserMiddleware = this.createMiddleware(this.createUser);

    private async createUser(ctx: AppContext) {
        const body = ctx.request.body;

        UserValidator.validateOrFail(UserValidator.createSchema, body);

        const user = this.repository.create({
            username: body.username,
            name: body.name,
            profileBanner: body.profileBanner,
            avatar: body.avatar
        });

        if ('isPrivate' in body) {
            user.isPrivate = body.isPrivate;
        }

        await this.repository.save(user);

        ctx.status = 201;
    }
}