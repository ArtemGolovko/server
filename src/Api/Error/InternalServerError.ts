import { AbstractError, ErrorBodyInterface } from "./AbstractError.js";

export class InternalServerError extends AbstractError {
    getStatus(): number {
        return 500;
    }

    getBody(): ErrorBodyInterface {
        return {
            code: '500',
            message: 'Internal Server Error: Undefined error',
            hint: 'Report error'
        }
    }
}
