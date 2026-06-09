import { AppError, AppSuccess } from "./StatusClasses";
import { Response } from "express";
import { SuccessDataStructure } from "../utils/CustomTypes";

/**
 * Classe che utilizza il Factory pattern per istanziare oggetti della classe AppError
 */
export class ErrorFactory {
  /**
   * Metodo statico che restituisce un oggetto AppError 
   * @param statusName valore dell'enum dei nomi degli errori 
   * @returns oggetto AppError contenente lo stato dell'errore
   */
  static getStatus(statusName: string): AppError {
    return new AppError(statusName);
  }
}

/**
 * Classe che utilizza il Factory pattern per istanziare oggetti della classe AppSuccess
 */
export class SuccessFactory {
  /**
   * Metodo statico che restituisce un oggetto AppSuccess 
   * @param statusName valore dell'ennum dei nomi delle richieste completate con successo
   * @param res oggetto Response per la risposta della richiesta
   * @param successData dati da inviare nella risposta alla richiesta
   * @returns oggetto AppSuccess contenente lo stato della richiesta completata con successo 
   */
  static getStatus(statusName: string, res?: Response,  successData?: SuccessDataStructure) {
    const dataMap = successData;
    return new AppSuccess(statusName, dataMap).send(res as Response);  
  }
}