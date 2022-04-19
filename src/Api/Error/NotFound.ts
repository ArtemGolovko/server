import { ErrorBodyInterface, AbstractError } from "./AbstractError.js";

class NotFound extends AbstractError {
    constructor(
        private resource: string, 
        private id: string|number
    ) {
        super();
    }

    getStatus(): number {
        return 404;
    }

    getBody(): ErrorBodyInterface {
        return {
            code: "404",
            message: `Not Found: The ${this.resource} resource with identifier '${this.id}' not found`,
            hint: 'Check if identifier is valid and resource with this identifier exists'
        }
    }
}


export const createNotFoundError = (resource: string, id: string|number) => {
    throw new NotFound(resource, id);
}
