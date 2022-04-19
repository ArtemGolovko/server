interface ErrorBody {
    code: string;
    message: string;
    hint: string;
}

export type ErrorBodyInterface = ErrorBody;

export abstract class AbstractError {
    abstract getStatus(): number;
    abstract getBody(): ErrorBodyInterface;
}
