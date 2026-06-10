import { Transaction, Op } from "sequelize";
import { Graph} from "../models/Graph";
import { Edge } from "../models/Edge";
import { UpdateLog } from "../models/UpdateLog";
import { GraphDAO } from "../dao/GraphDAO";
import { EdgeDAO } from "../dao/EdgeDAO";
import { UserDAO } from "../dao/UserDAO";
import { UpdateLogDAO } from "../dao/UpdateLogDAO";
import { ErrorFactory } from "../status/StatusFactory";
import { AppErrorNames } from "../enums/responseStatus/AppStatusNames";
import { updateStatus } from "../enums/UpdateEdgeStatus";
import { DBConnection } from "../db/Connection";
import { NODE_COST, EDGE_COST, AUTO_APPROVED_THRESHOLD } from "../utils/Const";
import LibGraph from "node-dijkstra"
import { UpdateLogFilter } from "../utils/CustomTypes";
import { getNodes } from "../utils/helperMethods";

/**
 * classe GraphService che implementa metodi che si interfacciano con il db 
 * riguardo azioni fatte sui grafi 
 */
export class GraphService {
    private graphDao: GraphDAO;
    private edgeDao: EdgeDAO;
    private userDao: UserDAO;
    private updateLogDao: UpdateLogDAO;

    /**
     * costruttore del Service che istanzia i DAO da chiamre per agire sul db
     */
    constructor() {
        this.graphDao = new GraphDAO();
        this.edgeDao = new EdgeDAO();
        this.userDao = new UserDAO();
        this.updateLogDao = new UpdateLogDAO();
    }

    /**
     * Metodo che richiama la query eseguita nel GraphDAO per leggere tutti i grafi con gli archi associati
     * @returns oggetto Promise che promette di restituire una lista di grafo
     */
    async getAllGraphs(): Promise<Graph[]> {
        return await this.graphDao.readAllWithEdges();
    }

    /**
     * Metodo che richiama la query nel GraphDAO per leggere un grafo e i suoi archi dato il suo id 
     * @param graphId id del grafo di cui recuperiamo i dati e gli archi associati
     * @returns oggeto Promise che promette di restituire un grafo. Se questo non viene trovato viene lanciato un errore
     */
    async getGraphById(graphId: number): Promise<Graph> {
        const graph = await this.graphDao.readWithEdges(graphId);
        if (!graph) {
            throw ErrorFactory.getStatus(AppErrorNames.GRAPH_NOT_FOUND);
        }
        return graph;
    }

    /**
     * Metodo che si occupa di creare un nuovo grafo andando ad inserire anche i suoi archi nel database
     * @param data entry contenente alcuni campi con cui creare il grafo e gli archi e sufficiente per ricavare i dati mancanti
     * @returns oggetto Promise che promette di ritornare l'oggetto Graph creato unito al numero di token rimanenti
     */
    async createGraph(data: { name: string; description: string; nodes: string[]; edges: any[]; userId: number}): Promise<Graph & { remainingTokens: number }> {
        const cost = (data.nodes.length * NODE_COST) + (data.edges.length * EDGE_COST);
        const sequelize = DBConnection.getInstance();

        return await sequelize.transaction(async (t: Transaction) => {
            const user = await this.userDao.read(data.userId);
            if (!user) {
                throw ErrorFactory.getStatus(AppErrorNames.USER_NOT_FOUND);
            }

            const currentTokens = user.get("qtyToken") as number;
            if (currentTokens < cost) {
                throw ErrorFactory.getStatus(AppErrorNames.INSUFFICIENT_TOKENS);
            }

            const graphData = {
                userId: data.userId,
                name: data.name,
                description: data.description,
                cost: cost
            };
            
            const newGraph = await this.graphDao.create(graphData as Graph, t);

            const edgesToCreate = data.edges.map((edge) => ({
                graphId: newGraph.get("graphId"),
                startNode: edge.startNode,
                endNode: edge.endNode,
                weight: edge.weight
            }));
            
            const createdEdges = await this.edgeDao.multiCreate(edgesToCreate, t);

            const newQty = currentTokens - cost;
            await this.userDao.update(data.userId, { qtyToken: newQty });

            (newGraph as any).edges = createdEdges;
            (newGraph as any).remainingTokens = newQty;

            return newGraph as Graph & { edges: Edge[]; remainingTokens: number };
        });
    }

    /**
     * Metodo che esegue l'algoritmo di Dijkstra sul grafo indicato per calcolare il percorso tra i due nodi indicati
     * @param graphId identificativo del grafo su cui applico l'algoritmo
     * @param startNode nodo di partenza del percorso
     * @param endNode nodo di arrivo del percorso
     * @param userId identificativo dell'utente che esegue l'algoritmo. utile per sapere a chi addebitare l'esecuzione
     * @returns oggetto promise che promette di ritornare un entry aventi alcuni dati da inviare successivamente al client (path, costo, tempo di esecuzione, token rimanenti all'utente)
     */
    async executeGraph(
        graphId: number, 
        startNode: string, 
        endNode: string, 
        userId: number
    ): Promise<{ path: string[] | null; totalWeight: number; executionTimeMs: number; remainingTokens: number }> {
        
        // recupero il grafo e i suoi archi
        const graph = await this.graphDao.readWithEdges(graphId);
        if (!graph) {
            throw ErrorFactory.getStatus(AppErrorNames.GRAPH_NOT_FOUND);
        }

        // recupero il costo da addebitare all'utente che esegue il modello
        const cost = graph.get("cost") as number;

        const user = await this.userDao.read(userId);
        if (!user) {
            throw ErrorFactory.getStatus(AppErrorNames.USER_NOT_FOUND);
        }

        const currentTokens = user.get("qtyToken") as number;
        if (currentTokens < cost) {
            throw ErrorFactory.getStatus(AppErrorNames.INSUFFICIENT_TOKENS);
        }

        const route = new LibGraph();
        const adjacencyList: Record<string, Record<string, number>> = {};
        
        // Creo le liste di adiacenza utile per creare il grafo come vuole la libreria node-dijkstra:
        // (node, {neighbours})
        const edges = graph.get("edges") as Edge[];

        const nodes = getNodes(edges);

        if (!nodes.includes(startNode) || !nodes.includes(endNode)) {
            throw ErrorFactory.getStatus(AppErrorNames.NODE_NOT_FOUND);
}

        edges.forEach((edge) => {
            const sNode = edge.get("startNode") as string;
            const eNode = edge.get("endNode") as string;
            const w = edge.get("weight") as number;

            if (!adjacencyList[sNode]) 
                adjacencyList[sNode] = {};
            adjacencyList[sNode][eNode] = w;
        });

        Object.keys(adjacencyList).forEach((node) => {
            route.addNode(node, adjacencyList[node]);
        });

        const startExecution = process.hrtime();
        const shortestPathResult = route.path(startNode, endNode, { cost: true });
        const elapsedExecution = process.hrtime(startExecution);
        
        const executionTimeMs = (elapsedExecution[0] * 1000) + (elapsedExecution[1] / 1000000);

        let path: string[] | null = null;
        let totalWeight = 0;

        if (shortestPathResult) {
            if (Array.isArray(shortestPathResult)) {
                path = shortestPathResult;
            } else if (Array.isArray(shortestPathResult.path)) {
                path = shortestPathResult.path;
                totalWeight = shortestPathResult.cost;
            }
        }

        await this.userDao.update(userId, { qtyToken: currentTokens - cost } as any);

        return {
            path,
            totalWeight,
            executionTimeMs,
            remainingTokens: currentTokens - cost
        };
    }

    /**
     * Metodo che esegue la modifica del peso di uno o più archi secondo la formula:
     * p(i,j) = alpha * p(i,j) + (1 – alpha) * p_new(i,j)
     * dove:
     * - p(i,j) è il precedente peso dell'arco da i a j
     * - p_new(i,j) è il nuovo peso inserito dall'utente dell'arco che va da i a j
     * - alpha è il coefficiente della media esponenziale
     * @param graphId identificativo numerico del grafo di cui modifico gli archi
     * @param updates lista degli archi da modificare espressi con la seguente struttura {edgeId: number, newWeight: number}
     * @param userId identificativo numerico dell'utente che richiede la modifica
     * @returns oggetto Promise che promette di tornare un array di entry con i dati dell'esito della modifica di ciascun arco ({ edgeId: number; status: string; currentWeight: number })
     */
    async updateEdges(
        graphId: number, 
        updates: { edgeId: number; newWeight: number }[], 
        userId: number
    ): Promise<{ edgeId: number; status: string; currentWeight: number }[]> {
        const envAlpha = parseFloat(process.env.ALPHA || "0.8");
        const ALPHA = (envAlpha > 0 && envAlpha < 1) ? envAlpha : 0.8;
        
        const sequelize = DBConnection.getInstance();

        const results: { edgeId: number; status: string; currentWeight: number }[] = [];
        const processedEdgeIds = new Set<number>();

        return await sequelize.transaction(async (t: Transaction) => {
            for (const update of updates) {
                if (processedEdgeIds.has(update.edgeId)) {
                    throw ErrorFactory.getStatus(AppErrorNames.DUPLICATE_UPDATE_REQUEST);
                }
                processedEdgeIds.add(update.edgeId);

                const edge = await this.edgeDao.read(update.edgeId, t);

                if (!edge) {
                    throw ErrorFactory.getStatus(AppErrorNames.EDGE_NOT_FOUND);
                }

                if (edge.get("graphId") !== graphId) {
                    throw ErrorFactory.getStatus(AppErrorNames.EDGE_NOT_IN_GRAPH);
                }

                const logs = await this.updateLogDao.readAllByStatus(updateStatus.PENDING);
                const existingPendingRequest = logs.find(log => log.get("edgeId") === edge.get("edgeId"));

                if (existingPendingRequest) {
                    throw ErrorFactory.getStatus(AppErrorNames.PENDING_REQUEST_EXISTS);
                }

                const oldWeight = edge.get("weight") as number;
                const proposedNewWeight = update.newWeight;
                const absoluteDifference = Math.abs(proposedNewWeight - oldWeight);
                const thresholdWeight = oldWeight * AUTO_APPROVED_THRESHOLD;
                const computedWeight = (ALPHA * oldWeight) + ((1 - ALPHA) * proposedNewWeight);

                if (absoluteDifference > thresholdWeight) {
                    const logData = {
                        requestedBy: userId,
                        edgeId: edge.get("edgeId"),
                        status: updateStatus.PENDING,
                        oldWeight: oldWeight,
                        newWeight: computedWeight
                    };
                    await this.updateLogDao.create(logData as any, t);

                    results.push({ edgeId: edge.get("edgeId") as number, status: updateStatus.PENDING, currentWeight: oldWeight });
                } else {
                    const computedWeight = (ALPHA * oldWeight) + ((1 - ALPHA) * proposedNewWeight);
                    
                    await this.edgeDao.update(edge.get("edgeId") as number, { weight: computedWeight }, t);

                    const logData = {
                        requestedBy: userId,
                        edgeId: edge.get("edgeId"),
                        status: updateStatus.APPROVED,
                        oldWeight: oldWeight,
                        newWeight: computedWeight,
                        resolvedBy: userId,
                        resolvedAt: new Date()
                    };

                    await this.updateLogDao.create(logData as any, t);

                    results.push({ edgeId: edge.get("edgeId") as number, status: updateStatus.APPROVED, currentWeight: computedWeight });
                }
            
            }
            return results;
        });
    }

    /**
     * Metodo che recupera l'elenco delle modifiche di un grafo filtrando per intervallo di date
     * @param graphId identificativo del grafo di cui si vogliono recuperare i log
     * @param filters oggetto contenente le date di inizio e fine per il filtro
     * @returns oggetto Promise che promette di ritornare l'elenco dei log di aggiornamento trovati
     */
    async getFilteredUpdateLogs(
        graphId: number, 
        filters: { startDate?: any; endDate?: any }
    ): Promise<UpdateLog[]> {
        
        const graph = await this.graphDao.read(graphId);
        if (!graph) {
            throw ErrorFactory.getStatus(AppErrorNames.GRAPH_NOT_FOUND);
        }

        const whereClause: UpdateLogFilter = {};
        
        if (filters.startDate || filters.endDate) {
            whereClause.requestedAt = {};
            if (filters.startDate) {
                whereClause.requestedAt[Op.gte] = new Date(filters.startDate as string);
            }
            if (filters.endDate) {
                whereClause.requestedAt[Op.lte] = new Date(filters.endDate as string);
            }
        }

        const logs = await this.updateLogDao.readAllFiltered(whereClause, graphId);
        
        return logs;
    }
}