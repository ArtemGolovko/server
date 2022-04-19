import { ErrorBodyInterface } from "../Api/Error/AbstractError.js";

interface HandleErrorResultInterface {
    status: number,
    body?: ErrorBodyInterface
}

export type HandleErrorResult = HandleErrorResultInterface;