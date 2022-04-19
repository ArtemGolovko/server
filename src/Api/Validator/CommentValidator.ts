import * as Joi from 'joi';
import { createHttpError } from '../Error/index.js';

export const validateCreate = (body: any) => {
    const schema = Joi.object({
        text: Joi.string().required()
    })

    const { error } = schema.validate(body);
    if (error !== undefined) createHttpError(400);
}

export const validateUpdate = (body: any) => {
    const schema = Joi.object({
        text: Joi.string().required()
    });

    const { error } = schema.validate(body);
    if (error !== undefined) createHttpError(400);
}