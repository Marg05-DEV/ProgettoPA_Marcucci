import { IDao } from "./IDao";
import { Edge } from "../models/Edge";
import { AppError } from "../status/StatusClasses";
import { AppErrorNames } from "../enums/responseStatus/AppStatusNames";
import { Transaction } from "sequelize";

export class EdgeDAO implements IDao<Edge> {

    /**
     * Crea un nuovo arco nel database
     * @param item Oggetto avente come attributi quelli del nuovo arco da creare
     * @returns Un oggetto Promise che se viene risolta restituisce l'oggetto Edge creato, altrimenti viene lanciato un errore se la creazione non va a buon fine.
     */
    async create(item: Edge): Promise<Edge> {
        try {
            return await Edge.create(item as Edge);
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Ricerca un singolo arco nel database tramite il suo id
     * @param id Il valore dell'id, campo identificativo univoco da ricercare nel database
     * @param transaction istanza della transazione Sequelize corrente
     * @returns Un oggetto Promise che se risolta restituisce l'oggetto Edge ricercato tramite l'id, altrimenti restituisce null se l'oggetto non viene trovato o potrebbe essere lanciato un errore se la richiesta non va a buon fine.
     */
    async read(id: number, t?: Transaction): Promise<Edge | null> {
        try {
            return await Edge.findByPk(id);
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Ricerca di tutti gli archi presenti nel database
     * @returns Un oggetto promise che se risolta restituisce un array di oggetti Edge, altrimenti potrebbe esser lanciato un errore se al richiesta non va a buon fine. 
     * Se non sono presenti archi nel database, l'array restituito è vuoto. 
     */
    async readAll(): Promise<Edge[]> {
        try {
            return await Edge.findAll();
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Aggiorna i valori di una parte degli attributi di un arco presente nel database.
     * @param itemId id dell'arco da aggiornare,
     * @param newData Insieme dei nuovi valori con cui aggiornare gli attributi dell'arco da modificare
     * @param transaction istanza della transazione Sequelize corrente
     * @returns Un oggetto Promise che se risolta restituisce l'oggetto Edge modificato, altrimenti restituisce null se l'arco da aggiornare non viene trovato o viene lanciato un errore se la richiesta non va a buon fine.
     */
    async update(itemId: number, newData?: Partial<Edge> | undefined, t?: Transaction): Promise<Edge | null> {
        try {
            const edge = await Edge.findByPk(itemId);
            if (!edge) return null;
            return await edge.update(newData ?? {});
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Crea più archi eseguendo una sola query
     * @param edges Array di oggetti contenenti i dati degli archi da creare
     * @param transaction istanza della transazione Sequelize corrente
     */
    async multiCreate(
        edges: { graphId: number; startNode: string; endNode: string; weight: number }[], 
        transaction: Transaction
    ): Promise<Edge[]> {
        try {
            return await Edge.bulkCreate(edges, { transaction });
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

}