import * as Joi from 'joi';
import { createHttpError } from '../Error/index.js';

export abstract class AbstractValidator {
    public static validateOrFail(schema: Joi.Schema, body: any) {
        const { error } = schema.validate(body);
        if (error !== undefined) createHttpError(400);
    }
}