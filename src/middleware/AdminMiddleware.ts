import { NextFunction, Request, Response } from "express";
import { ErrorFactory } from "../status/StatusFactory";
import { AppErrorNames } from "../enums/responseStatus/AppStatusNames";
import { checkJwt, decodeJwt } from "./UserMiddleware";
import { checkEmail } from "./AuthMiddleware";
import { updateStatus } from "../enums/UpdateEdgeStatus";

/**
 * Funzione di middleware che controlla se l'utente abbai il ruolo di amministratore (admin)
 * @param req oggetto Request da cui estrarre il token JWT
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { isAdmin } = decodeJwt(req);
        if (!isAdmin) {
            return next(ErrorFactory.getStatus(AppErrorNames.NOT_ADMIN));
        }
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Funzione di middleware che controlla se che il numero di token sia in un formato valido
 * @param req oggetto Request da cui estrarre la quantità di token da controllare
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
const checkAmount = (req: Request, res: Response, next: NextFunction) => {
    const { qtyToken } = req.body;

    if (!qtyToken || typeof qtyToken !== "number" || !Number.isInteger(qtyToken) || qtyToken <= 0) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_TOKEN_AMOUNT));
    }
    next();
};

/**
 * Funzione di middleware che controlla se l'identificativo del log di una modifica è in un formato valido
 * @param req oggetto Request da cui estrarre l'identificativo della modifica da controllare
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
const checkUpdateId = (req: Request, res: Response, next: NextFunction) => {
    const { updateId } = req.body;
    if (!updateId || typeof updateId !== "number" || !Number.isInteger(updateId) || updateId <= 0) {
        return next(ErrorFactory.getStatus(AppErrorNames.UPDATE_NOT_FOUND));
    }
    next();
};

/**
 * Funzione di middleware che controlla se lo status inserito per risolvere una richiesta di modifica è in un formato valido
 * @param req oggetto Request da cui estrarre lo status della richiesta da controllare
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
const checkStatus = (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;
    if (!status || typeof status !== "string") {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_STATUS));
    }
    if (status.trim() !== updateStatus.APPROVED && status.trim() !== updateStatus.REJECTED) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_STATUS));
    }
    next();
};

/**
 * Funzione di middleware che controlla se il campo isAdmin è in un formato valido
 * @param req oggetto Request da cui estrarre il valore di isAdmin da controllare
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
const checkIsAdminField = (req: Request, res: Response, next: NextFunction) => {
    const { isAdmin } = req.body;
    if (typeof isAdmin !== "boolean") {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_ROLE));
    }
    next();
};



// Pipeline per il controllo dell'autorizzazione e la validazione dei dati per la ricarica del credito di un utente (email e qtyToken)
export const rechargeTokenChecking = [checkJwt, checkAdmin, checkEmail, checkAmount];

// Pipeline per il controllo dell'autorizzazione e la validazione dei dati per la risoluzione di una richiesta di modifica (updateId e status)
export const pendingChecking = [checkJwt, checkAdmin, checkUpdateId, checkStatus];

// Pipeline per il controllo dell'autorizzazione per inviare al client la lista delle richieste di modifica pendenti
export const getPendingChecking = [checkJwt, checkAdmin];

// Pipeline per il controllo dell'autorizzazione e la validazione dei dati per la modifica del ruolo di un utente (email e isAdmin)
export const changeRoleChecking = [checkJwt, checkAdmin, checkEmail, checkIsAdminField];