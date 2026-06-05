import { AppError, AppSuccess } from "./StatusClasses";

export class StatusFactory {
  static getStatus(statusCode: number, statusName: string): AppError {
    
    switch (statusCode) {
      case 400: 
      case 401: 
      case 403: 
      case 404: 
      case 409: 
      case 500:
        return new AppError(statusCode);
        /*
      case 200:
      case 201:
      case 204:
        return new AppSuccess(statusCode);
        */
      default:
        throw new Error("Status code non gestito");
    }
  }
}