import { NextFunction, Request, Response } from "express";
import { ErrorFactory } from "../status/StatusFactory";
import { AppErrorNames } from "../enums/responseStatus/AppStatusNames";
import { checkJwt } from "./UserMiddleware";
import { updateStatus } from "../enums/UpdateEdgeStatus";
import { outputFormat } from "../enums/UpdateLogsFormat";

import { BodyRequestEdge, BodyRequestUpdate } from "../utils/CustomTypes";

/**
 * Funzione di supporto alle funzioni di middleware che racchiude le condizioni per avere una stringa valida
 * @param value valore da validare
 * @returns ritorna l'esito della condizione, cioè un valore booleano
 */
const isValidString = (value: any): boolean => {
    return value && typeof value === "string" && value.trim() !== "";
};

/**
 * Funzione di supporto alle funzioni di middleware che racchiude le condizioni per avere un arco di un grafo con un formato valido
 * @param edge arco da validare
 * @returns ritorna l'esito della condizione, cioè un valore booleano
 */
const isValidEdgeFormat = (edge: BodyRequestEdge): boolean => {
    if (!edge || typeof edge !== "object") return false;
    const { startNode, endNode, weight } = edge;
    
    return (
        isValidString(startNode) && 
        isValidString(endNode) && 
        typeof weight === "number" && 
        weight >= 0
    );
};

/**
 * Funzione di middleware che valuta se l'id inserito nel path sia valido
 * @param req oggetto Request da cui estrarre l'id da controllare
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id) || id <= 0) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_ID));
    }
    next();
};

/**
 * Funzione di middleware che valuta se i dati per la creazine di un grafo siano valido
 * @param req oggetto Request da cui estrarre i dati da controllare
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
export const validateCreateGraph = (req: Request, res: Response, next: NextFunction) => {

    /**
     * 1. Valuta che name, description, nodes e edges sono nel corretto formato
     * 2. Valuto che il nodo di partenza e di arrivo con cui definisco un arco siano presenti in nodes
     * 3. Verifico che il grafo sia connesso, cioè che ogni nodo è raggiungibile da qualsiasi nodo scelto
     */
    const { name, description, nodes, edges } = req.body;

    if (!isValidString(name)) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_GRAPH_NAME));
    }

    if (description && typeof description !== "string") {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_GRAPH_DESCRIPTION));
    }

    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_NODES_DATA));
    }
    if (!nodes.every(n => isValidString(n))) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_NODES_FORMAT));
    }

    const nodesSet = new Set<string>(nodes.map((node: string) => node.trim()));

    const neighborNodes: Record<string, string[]> = {};
    for (const node of nodesSet) neighborNodes[node] = [];

    if (!edges || !Array.isArray(edges) || edges.length === 0) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_EDGES_DATA));
    }

    for (const edge of edges) {
        if (!isValidEdgeFormat(edge)) {
            return next(ErrorFactory.getStatus(AppErrorNames.INVALID_EDGES_FORMAT));
        }


        if (!nodesSet.has(edge.startNode.trim()) || !nodesSet.has(edge.endNode.trim())) {
            return next(ErrorFactory.getStatus(AppErrorNames.EDGE_NODE_NOT_FOUND));
        }

        neighborNodes[edge.startNode.trim()]!.push(edge.endNode.trim());
    }

    const visited = new Set<string>();
    const startNode = nodes[0].trim();
    const queue: string[] = [startNode];
    visited.add(startNode);

    while (queue.length > 0) {
        const current = queue.shift()!;
        for (const neighbor of neighborNodes[current]!) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }

    if (visited.size !== nodesSet.size) {
        return next(ErrorFactory.getStatus(AppErrorNames.GRAPH_NOT_CONNECTED));
    }

    next();
};

/**
 * Funzione di middleware che valuta se i dati per l'esecuzione di un modello siano validi
 * @param req oggetto Request da cui estrarre i dati da controllare (startNode, endNode)
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
export const validateRunGraph = (req: Request, res: Response, next: NextFunction) => {
    const { startNode, endNode } = req.body;

    if (!isValidString(startNode) || !isValidString(endNode)) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_RUN_NODES));
    }

    next();
};

/**
 * Funzione di middleware che valuta sei dati delle richieste di modifica siano validi
 * @param req oggetto Request da cui estrarre la lista di richieste di modifica da controllare
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
export const validateUpdateEdges = (req: Request, res: Response, next: NextFunction) => {
    const { updatedEdges } = req.body as { updatedEdges: BodyRequestUpdate[] };

    if (!updatedEdges || !Array.isArray(updatedEdges) || updatedEdges.length === 0) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_EDGES_DATA));
    }

    for (const item of updatedEdges) {
        if (!item || typeof item !== "object") {
            return next(ErrorFactory.getStatus(AppErrorNames.INVALID_EDGES_FORMAT));
        }
        const { edgeId, newWeight } = item;
        if (typeof edgeId !== "number" || edgeId <= 0 || typeof newWeight !== "number" || newWeight < 0) {
            return next(ErrorFactory.getStatus(AppErrorNames.INVALID_EDGES_FORMAT));
        }
    }

    next();
};

/**
 * Funzione di middleware che valuta se i valori per filtrare la lista delle modifiche di un grafo siano validi
 * @param req oggetto Request da cui estrarre  i dati da controllare (startDate, endDate, format)
 * @param res oggetto Response che può essere utilizzato per inviare una risposta al client
 * @param next oggetto NextFunction che può essere utilizzato per chiamare la funzione successiva nella pipline o per inviare un errore gestito dall'handler degli errori
 */
export const validateLogFilters = (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;
    const { format } = req.body

    if (startDate && (typeof startDate !== "string" || isNaN(Date.parse(startDate)))) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_DATE_FORMAT));
    }
    if (endDate && (typeof endDate !== "string" || isNaN(Date.parse(endDate)))) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_DATE_FORMAT));
    }

    if (typeof format !== "string" || (format !== outputFormat.JSON && format !== outputFormat.CSV)) {
        return next(ErrorFactory.getStatus(AppErrorNames.INVALID_FORMAT_TYPE));
    }


    next();
};

// Pipeline per il controllo dell'autorizzazione per inviare al client la lista di tutti i grafi
export const getAllGraphsChecking = [checkJwt];

// Pipeline per il controllo dell'autorizzazione e la validazione dell'id del grafo da inviare al client
export const getGraphChecking = [checkJwt, validateIdParam];

// Pipeline per il controllo dell'autorizzazione e la validazione dei dati per la creazione di un nuovo grafo (la seguente struttura)
/**
 * {
 * name: string,
 * description: string,
 * nodes: [node: string, ],
 * edges: [{
 *      startNode: string,
 *      endNode: string,
 *      weight: number
 *  }, {}]
 * }
 */
export const createGraphChecking = [checkJwt, validateCreateGraph];

// Pipeline per il controllo dell'autorizzazione e la validazione dei dati per l'esecuzione di un modello (startNode, endNode, graphId)
export const runGraphChecking = [checkJwt, validateIdParam, validateRunGraph];

// Pipeline per il controllo dell'autorizzazione e la validazione dei dati per la modifica di uno o più archi (graphId e la seguente struttura)
/**
 * {
 * updates: [{
 *      edgeId: number,
 *      newWeight: number
 *  }, {}]
 * }
 */
export const updateGraphChecking = [checkJwt, validateIdParam, validateUpdateEdges];

// Pipeline per il controllo dell'autorizzazione e la validazione dei dati per l'invio al client degli update di un grafo con la possibilità di filtrare (startDate, endDate) e di scegliere il formato di output ('csv' o 'json')
export const getGraphLogChecking = [checkJwt, validateIdParam, validateLogFilters];