import { NextFunction, Request, Response } from "express";
import { ErrorFactory } from "../status/StatusFactory";
import { AppErrorNames } from "../enums/responseStatus/AppStatusNames";
import jwt from "jsonwebtoken";
import fs from "fs";
import { JwtPayload } from "../utils/CustomTypes";

/**
 * Funzione di middleware che controlla se il token JWT è presente
 * @param req oggetto Request da cui estrarre il token JWT da controllare
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(ErrorFactory.getStatus(AppErrorNames.JWT_NOT_PROVIDED));
    }

    next();
    
};


/**
 * Funzione di middleware che controlla se l'utente è proprietario della risorsa o è un amministratore
 * @param req oggetto Request da cui estrarre il token JWT contenente nel payload i dati da controllare
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
const checkOwnerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, isAdmin } = decodeJwt(req);
        const paramId: number = parseInt(req.params.id as string);

        if (isNaN(paramId) || paramId <= 0) {
            return next(ErrorFactory.getStatus(AppErrorNames.INVALID_ID));
    }

        if (userId !== paramId && !isAdmin) {
            return next(ErrorFactory.getStatus(AppErrorNames.NOT_OWNER_OR_ADMIN));
        }

        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Funzione di middleware che decifra il token JWT controllando sia in un formato valido
 * @param req oggetto Request da cui estrarreil token JWT
 * @returns ritorna il jwtPayload ottenuto dal token JWT
 */
export const decodeJwt = (req: Request): JwtPayload => {
    const auth = req.headers.authorization;

    if (!auth) {
        throw ErrorFactory.getStatus(AppErrorNames.JWT_NOT_PROVIDED);
    }

    const splittedToken = auth.split(" ");

    if (splittedToken.length !== 2 || splittedToken[0] !=="Bearer") {
        throw ErrorFactory.getStatus(AppErrorNames.INVALID_JWT);
    }

    try {
        const key_path = process.env.JWT_PUBLIC_KEY_PATH || "./keys/jwtRS256.key.pub";

        const publicKey = fs.readFileSync(key_path).toString();
        console.log("UserMiddleware:", publicKey)

        if (!publicKey) {
            throw ErrorFactory.getStatus(AppErrorNames.JWT_PUBLIC_MISSING);
        }

        return jwt.verify(splittedToken[1] as string, publicKey, { algorithms: ["RS256"] }) as JwtPayload;
    } catch (err) {
        throw ErrorFactory.getStatus(AppErrorNames.INVALID_JWT);
    }
}



// Pipeline dei middleware per ottenere
export const getUserChecking = [checkJwt, checkOwnerOrAdmin]