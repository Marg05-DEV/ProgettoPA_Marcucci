import { IDao } from "./IDao";
import { Graph } from "../models/Graph";
import { AppError } from "../status/StatusClasses";
import { AppErrorNames } from "../enums/responseStatus/AppStatusNames";
import { Transaction } from "sequelize";
import { Edge } from "../models/Edge";

export class GraphDAO implements IDao<Graph> {

    /**
     * Crea un nuovo grafo nel database
     * @param item Oggetto avente come attributi quelli del nuovo grafo da creare
     * @param transaction istanza della transazione Sequelize corrente
     * @returns Un oggetto Promise che se viene risolta restituisce l'oggetto Graph creato, altrimenti viene lanciato un errore se la creazione non va a buon fine.
     */
    async create(item: Graph, t?: Transaction): Promise<Graph> {
        try {
            return await Graph.create(item as Graph, { transaction: t ?? null });
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Ricerca un singolo grafo nel database tramite il suo id
     * @param id Il valore dell'id, campo identificativo univoco da ricercare nel database
     * @returns Un oggetto Promise che se risolta restituisce l'oggetto Graph ricercato tramite l'id, altrimenti restituisce null se l'oggetto non viene trovato o potrebbe essere lanciato un errore se la richiesta non va a buon fine.
     */
    async read(id: number): Promise<Graph | null> {
        try {
            return await Graph.findByPk(id);
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Ricerca di tutti i grafi presenti nel database
     * @returns Un oggetto promise che se risolta restituisce un array di oggetti Graph, altrimenti potrebbe esser lanciato un errore se al richiesta non va a buon fine. 
     * Se non sono presenti grafi nel database, l'array restituito è vuoto. 
     */
    async readAll(): Promise<Graph[]> {
        try {
            return await Graph.findAll();
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Aggiorna i valori di una parte degli attributi di un grafo presente nel database.
     * @param itemId id del grafo da aggiornare,
     * @param newData Insieme dei nuovi valori con cui aggiornare gli attributi del grafo da modificare
     * @param transaction istanza della transazione Sequelize corrente
     * @returns Un oggetto Promise che se risolta restituisce l'oggetto Graph modificato, altrimenti restituisce null se il grafo da aggiornare non viene trovato o viene lanciato un errore se la richiesta non va a buon fine.
     */
    async update(itemId: number, newData?: Partial<Graph> | undefined, t?: Transaction): Promise<Graph | null> {
        try {
            const graph = await Graph.findByPk(itemId);
            if (!graph) return null;
            return await graph.update(newData ?? {}, { transaction: t ?? null });
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Ricerca di tutti i grafi presenti nel database associandogli i rispettivi archi
     * @returns Un oggetto promise che se risolta restituisce un array di oggetti Graph, altrimenti potrebbe esser lanciato un errore se al richiesta non va a buon fine. 
     * Se non sono presenti grafi nel database, l'array restituito è vuoto. 
     */
    async readAllWithEdges(): Promise<Graph[]> {
        try {
            return await Graph.findAll({ include: { model: Edge, as: "edges" } });
        } catch (err) {
            console.log(err)
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Ricerca un grafo nel database tramite il suo id e gli associa i suoi archi
     * @param graphId id del grafo da ricercare
     * @returns  Un oggetto promise che se risolta restituisce un oggetto Graph, altrimenti, se non viene trovato restituisce null.
     * Se la richiesta non va a buon fien viene lanciato un errore
     */
    async readWithEdges(graphId: number): Promise<Graph | null> {
        try {
            return await Graph.findByPk(graphId, { include: { model: Edge, as: "edges" } });
        } catch (err) {
            console.log(err)
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

}

