import type { HandleErrorResult } from "../../Type/index.js";
import { AbstractError } from './AbstractError.js'
import { createNotFoundError } from "./NotFound.js";
import { createUnauthorizedError } from "./Unauthorized.js";
import { createForbiddenError } from "./ForbiddenError.js";
import { InternalServerError } from "./InternalServerError.js";
import { createBadRequestError } from "./BadRequestError.js";

export const createHttpError = (status: number) => {
    throw status;
}

export const handleError = (error: any): HandleErrorResult  => {
    if (error instanceof AbstractError)
        return { status: error.getStatus(), body: error.getBody() };

    if (typeof error === 'number')
        return { status: error };

    console.log(error);
    const internalServerError = new InternalServerError();
    return { status: internalServerError.getStatus(), body: internalServerError.getBody() };
}

export {
    createNotFoundError,
    createUnauthorizedError,
    createForbiddenError,
    createBadRequestError
};