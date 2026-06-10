import { NextFunction, Request, Response } from "express";
import { ErrorFactory } from "../status/StatusFactory";
import { AppErrorNames } from "../enums/responseStatus/AppStatusNames";

/**
 * Funzione di middleware che controlla se l'email è in un formato valido
 * @param req oggetto Request da cui estrarre l'email da controllare
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
export const checkEmail = (req: Request, res: Response, next: NextFunction) => {
    // Regex che valida l'email: deve contenere almeno un carattere prima della "@", almeno un carattere dopo, seguito da un "." e almeno un altro carattero dopo indicante il dominio
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const email = req.body.email;
    
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_EMAIL)); // errore email non valida
    }

    next(); // checkPassword()
}

/**
 * Funzione di middleware che controlla se la password è in un formato valido
 * @param req oggetto Request da cui estrarre la password da controllare
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
export const checkPassword = (req: Request, res: Response, next: NextFunction)  => {
    // Regex che valida la password: deve essere lunga almeno 8 caratteri, contenere almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!?_#$%&()*.,])[A-Za-z\d@!?_#$%&()*.,]{8,}$/;

    const password = req.body.password;

    if (!password || typeof password !== "string" || !passwordRegex.test(password.trim())) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_PASSWORD)); // errore password non valida
    }

    next(); // AuthController.login()
}

/**
 * Funzione di middleware che controlla se lo username è in un formato valido
 * @param req oggetto Request da cui estrarre lo username da controllare
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
export const checkUsername = (req: Request, res: Response, next: NextFunction) => {
    // Regex che valida lo username: deve essere lungo almeno 3 caratteri e al massimo 20, e può contenere solo lettere, numeri e underscore
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    const username = req.body.username;

    if (!username || typeof username !== "string" || !usernameRegex.test(username.trim())) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_USERNAME)); // errore username non valido
    }

    next(); // checkEmail()
}


// Pipline per la validazione dei dati di login (email e password)
export const validateLogin = [checkEmail, checkPassword]

// Pipline per la validazione dei dati di registrazione (username, email e password)
export const validateRegister = [checkUsername, checkEmail, checkPassword]