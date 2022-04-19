import { AbstractError, ErrorBodyInterface } from "./AbstractError.js";

enum BadRequest {
    Validation = 0,
    NotFount = 1
}

class BadRequestError extends AbstractError {
    constructor(
        private reason: BadRequest,
        private error?: string
    ) {
        super()
    }

    getMessage() {
        switch (this.reason) {
            case 0: return `Validation error '${this.error}'`;
            case 1: return 'Resource not found';
        }
    }

    getHint() {
        switch (this.reason) {
            case 0: return 'to do';
            case 1: return 'to do';
        }
    }

    getStatus(): number {
        return 400
    }

    getBody(): ErrorBodyInterface {
        return {
            code: `400:${this.reason}`,
            message: `Bad Request: ${this.getMessage()}`,
            hint: this.getHint()
        }
    }
}

export const createBadRequestError = (reason: BadRequest, error?: string) => {
    throw new BadRequestError(reason, error);
}