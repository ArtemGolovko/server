import { AbstractError, ErrorBodyInterface } from "./AbstractError.js";

enum UnauthorizedEnum {
    NoAuthorization = 0,
    NotFound = 1
}

class UnauthorizedError extends AbstractError {
    constructor(
        private reason: UnauthorizedEnum
    ) {
        super()
    }

    private getMessage() {
        switch (this.reason) { 
            case 0: return 'No authorization found';
            case 1: return 'No user found';
        }
    }

    private getHint() {
        switch (this.reason) {
            case 0: return 'Add Authorization header with value: \'Bearer {username}\'';
            case 1: return 'Check if user with this username exists';
        }
    }

    getStatus(): number {
        return 401;
    }

    getBody(): ErrorBodyInterface {
        return {
            code: `401:${this.reason}`,
            message: `Unauthorized: ${this.getMessage()}`,
            hint: this.getHint()
        }
    }
}

export const createUnauthorizedError = (reason: UnauthorizedEnum) => {
    throw new UnauthorizedError(reason);
}
