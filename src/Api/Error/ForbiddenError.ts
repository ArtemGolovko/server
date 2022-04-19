import { AbstractError, ErrorBodyInterface } from "./AbstractError.js";

class ForbiddenError extends AbstractError {
    getStatus(): number {
        return 403;
    }

    getBody(): ErrorBodyInterface {
        return {
            code: '403',
            message: 'Forbidden: Currntly authenticated user doesn\'t have access to this resource',
            hint: 'Check if Currntly authenticated user is own or has access on this resource'
        }
    }
}

export const createForbiddenError = () => {
    throw new ForbiddenError();
}