import { StatusStructure, errorsMap, successesMap } from "./StatusMapping";
import { Response } from "express";
import { SuccessDataStructure } from "../utils/CustomTypes";

/** 
 * Struttura minima da implementare per AppError e AppSuccess
 */ 
interface AppStatus{
    name: string;
    statusCode: number;
}

/**
 * Classe per istanziare oggetti contenenti lo stato dell'errore. Questa eredita la classe Error
 * che implementa l'attributo message
 */
export class AppError extends Error implements AppStatus {
    public name: string;
    public statusCode: number;

    /**
     * Costruttore che istanzia l'oggetto AppError.
     * @param errName nome dell'errore usato come indice nel mapping degli errori per recuperare i valori degli altri campi (message e statusCode)
     */
    constructor(public errName: string) {
        const error = errorsMap[errName] as StatusStructure;
        super(error.message);
        console.log(error);
        this.name = error.name;
        this.statusCode = error.statusCode;
    }

    /**
     * Metodo che invia la risposta con lo stato e il json dell'errore.
     * @param res oggetto Response su cui scrivere lo status e il JSON.
     */
    send(res: Response) {
        res.status(this.statusCode).json(this.getJSON());
    }

    /**
     * Metodo per ricavare il json delle informazioni dell'errore
     * @returns struttura json con le informazioni sull'errore
     */
    getJSON() {
        return {
            error_name: this.name,
            error_message: this.message
        }
    }
}

/**
 * Classe per istanziare oggetti contenenti lo stato della risposta effettuata con successo. 
 */
export class AppSuccess implements AppStatus {
    public message: string;
    public name: string;
    public statusCode: number;
    public data: SuccessDataStructure;

    /**
     * Costruttore che istanzia l'oggetto AppSuccess.
     * @param successName stringa contenente il nome della risposta utilizzata come indice per ricavare le informazioni della risposta attraverso il mapping
     * @param successData oggetto che segue la struttura definita dall'interfaccia SuccessDataStructure che contiene i dati da mostrare nella risposta
     */
    constructor(public successName: string, public successData: SuccessDataStructure = {}) {
        const success = successesMap[successName] as StatusStructure;
        console.log(success);
        this.name = success.name;
        this.message = success.message;
        this.statusCode = success.statusCode;
        console.log("prima", successData)
        this.data = successData;
    }

    /**
     * Metodo che invia la risposta contenente il messaggio di esecuzioen con successo e i dati da inviare al client.
     * @param res oggetto Response su cui scrivere il messaggio e i dati.
     */
    send(res: Response) {
        res.status(this.statusCode).json(this.getJSON());
    }

    /**
     * Metodo per ricavare il json delle informazioni della risposte
     * @returns struttura json con le informazioni sulla risposta
     */
    getJSON() {
        return {
            message: this.message,
            data: this.data
        }
    }
}
