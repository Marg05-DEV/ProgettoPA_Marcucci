import { errorsMap, successesMap } from "./StatusMapping";

export class AppError extends Error {
    constructor(public errName: string) {
        const error = errorsMap[errName];
        super(error.message);
        console.log(error);
        this.name = error.name;
        this.message = error.message;
        this.statusCode = error.statusCode;
        
    }
}

export class AppSuccess {
    constructor(public successName: string) {
        const success = successesMap[successName];
        console.log(success);
        this.name = success.name;
        this.message = success.message;
        this.statusCode = success.statusCode;
    }
}