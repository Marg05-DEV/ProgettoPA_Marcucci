import { Request, Response } from "express";
import { GraphService } from "../services/GraphService";
import { AppError } from "../status/StatusClasses";
import { SuccessFactory, ErrorFactory } from "../status/StatusFactory";
import { AppSuccessNames, AppErrorNames } from "../enums/responseStatus/AppStatusNames";
import { decodeJwt } from "../middleware/UserMiddleware";
import { BodyRequestEdge, BodyRequestUpdate, SuccessDataStructure } from "../utils/CustomTypes";
import { Edge } from "../models/Edge";
import { getEdges } from "../utils/helperMethods";
import { StatusCodes } from "http-status-codes";

export class GraphController {
    private graphService: GraphService;

    constructor() {
        this.graphService = new GraphService();
    }

    /**
     * Metodo del controller per ricevere tutti i grafi presenti nel database. Restituise una lista
     * @param req oggetto Request 
     * @param res oggetto Response che sfrutto per restituire al client la lista dei grafi
     */
    async getAllGraphs(req: Request, res: Response) {
        try {
            const graphs = await this.graphService.getAllGraphs();
            
            const graphsList = graphs.map((graph) => {
                // recupero la lista di archi associati al grafo che itero
                const edges = (graph.get("edges") as Edge[]) || [];

                // creo al struttura di output di ogni grafo
                return {
                    graphId: graph.get("graphId"),
                    name: graph.get("name"),
                    description: graph.get("description") ?? "",
                    cost: graph.get("cost"),
                    nodes: getEdges(edges), 
                    edges: edges.map((edge) => ({
                        startNode: edge.get("startNode"),
                        endNode: edge.get("endNode"),
                        weight: edge.get("weight")
                    }))
                };
            });

            const responseData: SuccessDataStructure = { graphs: graphsList } as any as SuccessDataStructure;

            SuccessFactory.getStatus(AppSuccessNames.GRAPHS_FOUND, res, responseData);
        } catch (err) {
            if (err instanceof AppError) {
                (err as AppError).send(res);
            }
        }
    }

    /**
     * Metodo del controller per gestire la creazione di un nuovo grafo
     * @param req oggetto Request da cui recupero i dati del nuovo grafo
     * @param res oggetto Response con cui invio al client l'esito dell'operazione
     */
    async createGraph(req: Request, res: Response) {
        try {
            const { name, description, nodes, edges } = req.body;
            const userId = decodeJwt(req).userId;

            const newGraph = await this.graphService.createGraph({name, description, nodes, edges, userId});

            const savedEdges = (newGraph as any).edges as Edge[] || [];

            const responseData = {
                graphId: newGraph.get("graphId"),
                name: newGraph.get("name"),
                description: newGraph.get("description") ?? "",
                cost: newGraph.get("cost"),
                remainingTokens: (newGraph as any).remainingTokens,
                nodes: getEdges(edges), 
                edges: savedEdges.map((edge) => ({
                    edgeId: edge.get("edgeId"),
                    startNode: edge.get("startNode"),
                    endNode: edge.get("endNode"),
                    weight: edge.get("weight")
                }))
            };

            SuccessFactory.getStatus(AppSuccessNames.GRAPH_CREATED, res, responseData);
        } catch (err) {
            if (err instanceof AppError) {
                (err as AppError).send(res);
            }
        }
    }

    /**
     * Metodo del controller per recuperare i dati di un grafo specificato tramite il suo id
     * @param req oggetto Request da cui recupero l'id del grafo da ricercare
     * @param res oggetto Response con cui invio al client il grafo ricercato
     */
    async getGraphById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);

            if (isNaN(id) || id <= 0) {
                throw ErrorFactory.getStatus(AppErrorNames.INVALID_ID); 
            }

            const graph = await this.graphService.getGraphById(id);

            const savedEdges = (graph.get("edges") as Edge[]) || [];

            const responseData = {
                graphId: graph.get("graphId"),
                name: graph.get("name"),
                description: graph.get("description") ?? "",
                cost: graph.get("cost"),
                nodes: getEdges(savedEdges),
                edges: savedEdges.map((edge) => ({
                    edgeId: edge.get("edgeId"),
                    startNode: edge.get("startNode"),
                    endNode: edge.get("endNode"),
                    weight: edge.get("weight")
                }))
            };

            SuccessFactory.getStatus(AppSuccessNames.GRAPH_FOUND, res, responseData);
        } catch (err) {
            if (err instanceof AppError) {
                (err as AppError).send(res);
            }
        }
    }

    /**
     * Metodo del controller per eseguire l'algoritmo di Dijkstra su un grafo per calcolare il percorso
     * @param req oggetto Request che contiene il nodo si partenza e di arrivo del perocrso da calcolare
     * @param res oggetto Response con cui invio al client il percorso calcolato, il costo in termini di pesi e il tempo di esecuzione
     */
    async runGraph(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            
            if (isNaN(id) || id <= 0) {
                throw ErrorFactory.getStatus(AppErrorNames.INVALID_ID); 
            }

            const { startNode, endNode } = req.body as { startNode: string, endNode: string };
            const userId = decodeJwt(req).userId;

            const result = await this.graphService.executeGraph(id, startNode, endNode, userId);

            const responseData: SuccessDataStructure = {
                path: result.path ?? [],
                totalWeight: result.totalWeight,
                executionTimeMs: result.executionTimeMs,
                remainingTokens: result.remainingTokens
            };

            SuccessFactory.getStatus(AppSuccessNames.SHORTEST_PATH_COMPUTED, res, responseData);
        } catch (err) {
            if (err instanceof AppError) {
                (err as AppError).send(res);
            }
        }
    }

    /**
     * Metodo del controller per aggiornare uno o più archi di un grafo
     * @param req oggetto Request che contiene la lista di archi con il nuovo peso: [{edgeId: number, newWeight: number}]
     * @param res oggetto Response con cui invio al client l'esito dell'operazione
     */
    async updateEdges(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);

            if (isNaN(id) || id <= 0) {
                throw ErrorFactory.getStatus(AppErrorNames.INVALID_ID); 
            }

            const { updatedEdges } = req.body;
            const userId = decodeJwt(req).userId;

            const updatedResult = await this.graphService.updateEdges(id, updatedEdges, userId);

            const responseData: SuccessDataStructure = {
                graphId: id,
                processedUpdates: updatedResult
            };

            SuccessFactory.getStatus(AppSuccessNames.GRAPH_EDGES_UPDATED, res, responseData);
        } catch (err) {
            if (err instanceof AppError) {
                (err as AppError).send(res);
            }
        }
    }

    /**
     * Metodo del controller per ricevere l'elenco delle modifiche di un grafo filtrate per data
     * @param req oggetto Request che contiene i valori di filtro e il formato dell'output
     * @param res oggetto Response con cui invio al client la lista delle modifiche filtrate
     */
    async getLog(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);

            if (isNaN(id) || id <= 0) {
                throw ErrorFactory.getStatus(AppErrorNames.INVALID_ID); 
            }

            const { startDate, endDate } = req.query;
            const { format } = req.body
            const logs = await this.graphService.getFilteredUpdateLogs(id, { startDate, endDate });

            const logsArray = logs.map((entry) => ({
                updateId: entry.get("updateId"),
                requestedBy: entry.get("requestedBy"),
                edgeId: entry.get("edgeId"),
                status: entry.get("status"),
                oldWeight: entry.get("oldWeight"),
                newWeight: entry.get("newWeight"),
                resolvedBy: entry.get("resolvedBy"),
                requestedAt: entry.get("requestedAt"),
                resolvedAt: entry.get("resolvedAt")
            }));

            if (format === 'csv') {
                const header = "updateId,requestedBy,edgeId,status,oldWeight,newWeight,resolvedBy,requestedAt,resolvedAt\n";
                const rows = logsArray.map(l => 
                    `${l.updateId},${l.requestedBy},${l.edgeId},${l.status},${l.oldWeight},${l.newWeight},${l.resolvedBy || ''},${l.requestedAt},${l.resolvedAt || ''}`
                ).join("\n");

                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename="logs.csv"');
                return res.status(StatusCodes.OK).send(header + rows);
            }

            const responseData: SuccessDataStructure = { pendingUpdateRequests: logsArray };

            SuccessFactory.getStatus(AppSuccessNames.GRAPH_LOGS_FOUND, res, responseData);
        } catch (err) {
            if (err instanceof AppError) {
                (err as AppError).send(res);
            }
        }
    }
}