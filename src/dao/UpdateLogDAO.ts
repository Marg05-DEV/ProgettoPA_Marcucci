import { IDao } from "./IDao";
import { UpdateLog } from "../models/UpdateLog";
import { AppError } from "../status/StatusClasses";
import { AppErrorNames } from "../enums/responseStatus/AppStatusNames";
import { Transaction } from "sequelize";

export class UpdateLogDAO implements IDao<UpdateLog> {

    /**
     * Crea un nuovo log entry delle modifiche nel database
     * @param item Oggetto avente come attributi quelli del nuovo log entry da creare
     * @param transaction istanza della transazione Sequelize corrente
     * @returns Un oggetto Promise che se viene risolta restituisce l'oggetto UpdateLog creato, altrimenti viene lanciato un errore se la creazione non va a buon fine.
     */
    async create(item: UpdateLog, t?: Transaction): Promise<UpdateLog> {
        try {
            return await UpdateLog.create(item as UpdateLog, { transaction: t  ?? null });
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Ricerca un singolo log entry nel database tramite il suo id
     * @param id Il valore dell'id, campo identificativo univoco da ricercare nel database
     * @returns Un oggetto Promise che se risolta restituisce l'oggetto UpdateLog ricercato tramite l'id, altrimenti restituisce null se l'oggetto non viene trovato o potrebbe essere lanciato un errore se la richiesta non va a buon fine.
     */
    async read(id: number): Promise<UpdateLog | null> {
        try {
            return await UpdateLog.findByPk(id);
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Ricerca di tutti i log entry presenti nel database
     * @returns Un oggetto promise che se risolta restituisce un array di oggetti UpdateLog, altrimenti potrebbe esser lanciato un errore se al richiesta non va a buon fine. Se non sono presenti archi nel database, l'array restituito è vuoto. 
     */
    async readAll(): Promise<UpdateLog[]> {
        try {
            return await UpdateLog.findAll();
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Aggiorna i valori di una parte degli attributi di un log entry presente nel database.
     * @param itemId id dell'log entry da aggiornare,
     * @param newData Insieme dei nuovi valori con cui aggiornare gli attributi del log entry da modificare
     * @param transaction istanza della transazione Sequelize corrente
     * @returns Un oggetto Promise che se risolta restituisce l'oggetto UpdateLog modificato, altrimenti restituisce null se l'arco da aggiornare non viene trovato o viene lanciato un errore se la richiesta non va a buon fine.
     */
    async update(itemId: number, newData?: Partial<UpdateLog> | undefined, t?: Transaction): Promise<UpdateLog | null> {
        try {
            const updateLog = await UpdateLog.findByPk(itemId);
            if (!updateLog) return null;
            return await updateLog.update(newData ?? {}, { transaction: t  ?? null });
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Ricerca di tutti i log entry presenti nel database che hanno uno status dato
     * @param status status con cui filtrare i log entry,
     * @returns Un oggetto promise che se risolta restituisce un array di oggetti UpdateLog, altrimenti potrebbe esser lanciato un errore se al richiesta non va a buon fine. Se non sono presenti modifiche degli archi nel database, l'array restituito è vuoto. 
     */
    async readAllByStatus(status: string): Promise<UpdateLog[]> {
        try {
            return await UpdateLog.findAll({ where: {status: status}});
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Ricerca di tutti i log entry presenti nel database che verificano il filtro
     * @param whereClause contiene le condizioni con cui filtrare
     * @returns Un oggetto Promise che se risolta restituisce un array di oggetti UpdateLog,altrimenti potrebbe esser lanciato un errore se al richiesta non va a buon fine. Se non sono presenti modifiche degli archi nel database, l'array restituito è vuoto.
     */
    async readAllFiltered(whereClause: any): Promise<UpdateLog[]> {
        try{
            return await UpdateLog.findAll({ where: whereClause });
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }
}