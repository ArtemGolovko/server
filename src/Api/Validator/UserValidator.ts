import * as Joi from 'joi';
import { createHttpError } from '../Error/index.js';
import { AbstractValidator } from './AbstractValidator.js';

export class UserValidator extends AbstractValidator {
    public static readonly createSchema = Joi.object({
        username: Joi.string().max(255).pattern(/[a-zA-Z0-9_]+/).required(),
        name: Joi.string().max(255).required(),
        profileBanner: Joi.string().max(255).required(),
        avatar: Joi.string().max(255).required(),
        isPrivate: Joi.boolean().optional()
    });

    public static readonly updateSchema = Joi.object({
        name: Joi.string().max(255).optional(),
        profileBanner: Joi.string().max(255).optional(),
        avatar: Joi.string().max(255).optional(),
        isPrivate: Joi.boolean().optional()
    }).required().min(1);
}