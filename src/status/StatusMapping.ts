import { AppErrorNames } from "../enums/responseStatus/AppStatusNames";
import { AppErrorMessages } from "../enums/responseStatus/AppStatusMessages";
import { StatusCodes } from "http-status-codes";

/*
    Interfaccia che definisce la struttura di ciascun errore che è quindi descritto
    da un name: string, un message: string e lo statusCode: number
*/
export interface ErrorStructure {
    name: string;
    message: string;
    statusCode: number;
}

/*
    Mappa che associa ad ogni name degli errori (key) un oggetto (value) che rispetta il contratto definito 
    dall'interfaccia ErrorStructure. In questo modo, grazie al nome, è possibile recuperare
    tutte le informazioni relative ad un determinato errore.
*/

export const errorsMap: Record<string, ErrorStructure> = {
    [AppErrorNames.INVALID_JWT]: {
        name: AppErrorNames.INVALID_JWT,
        message: AppErrorMessages.INVALID_JWT,
        statusCode: StatusCodes.UNAUTHORIZED
    },
}


export const successesMap: Record<string, ErrorStructure> = {
    
}