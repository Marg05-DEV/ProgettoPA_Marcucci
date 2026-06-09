import { Op } from "sequelize";

/**
 * Tipo utilizzato per indicare la struttura del campo data nelle risposte effettuate con successo
 */
export type SuccessDataStructure = Record<string, string | number | boolean | Date | Array<SuccessDataStructure> | Array<string> |undefined>;

/**
 * Struttura indicante i campi ricavabili dal payload del token JWT
 */
export interface JwtPayload {
    userId: number;
    email: string;
    isAdmin: boolean;
}

/**
 * Struttura di come è rappresentato un arco all'interno del body di una richiesta
 */
export interface BodyRequestEdge {
    startNode: string; // nodo di aprtenza
    endNode: string;   // nodo di arrivo
    weight: number;    // peso dell'arco
}

/**
 * Struttura di una richiesta di modifica di un arco all'interno del body di una richiesta
 */
export interface BodyRequestUpdate {
    edgeId: number;    // identificativo dell'arco
    newWeight: number; // nuovo peso dell'arco
}

/**
 * Struttura dei campi con cui filtrare il log delle modifiche di un grafo
 */
export interface UpdateLogFilter {
    graphId: number,
    requestedAt?: {
        [Op.gte]?: Date;
        [Op.lte]?: Date;
    };
}