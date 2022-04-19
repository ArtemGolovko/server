import * as Joi from 'joi';
import { createBadRequestError, createHttpError } from '../Error/index.js';

export const validateCreate = (body: any) => {
    const schema = Joi.object({
        text: Joi.string().required(),
        hashtags: Joi.array().items(Joi.string().max(255)).optional(),
        images: Joi.array().items(Joi.string()).optional(),
        profileMarks: Joi.array().items(Joi.string().max(255).pattern(/[a-zA-Z0-9_]+/)).optional(),
    });

    const { error } = schema.validate(body);
    console.log(error);
    if (error !== undefined) createBadRequestError(0, error.message);
}

export const validateUpdate = (body: any) => {
    const schema = Joi.object({
        text: Joi.string().optional(),
        hashtags: Joi.array().items(Joi.string().max(255)).optional(),
        profileMarks: Joi.array().items(Joi.string().max(255).pattern(/[a-zA-Z0-9_]+/)).optional(),
        images: Joi.array().items(Joi.string()).optional()
    }).required().min(1);
    
    const { error } = schema.validate(body);
    if (error !== undefined) createHttpError(400);
}