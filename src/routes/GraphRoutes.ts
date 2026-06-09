
import Router from "express";
import { Request, Response } from "express";
import { GraphController } from "../controllers/GraphController";
import { getAllGraphsChecking, createGraphChecking, getGraphChecking, runGraphChecking, updateGraphChecking, getGraphLogChecking } from "../middleware/GraphMiddleware";

/**
 * Rotte riguardanti i grafi:
 * - getAllGraphs: GET /graphs
 * - createGraph: POST /graphs
 * - getGraphById: GET /graphs/:id
 * - runGraph: POST /graphs/:id/run
 * - updateGraphEdges: PATCH graphs/:id
 * - getGraphLog: GET graphs/:id/log?startDate=&endDate=&
 */

export const graphRouter = Router();
const graphController = new GraphController();

/**
 * Rotta per ricevere la lista di tutti i grafi
 * 1. Riceve la richiesta
 * 2. Valuta che l'utente abbia l'autorizzazione, cioè checkJwt
 * 3. Restituisce la lista dei grafi
 */
graphRouter.get("/", getAllGraphsChecking, (req: Request, res: Response) => {
  graphController.getAllGraphs(req, res);
});

/**
 * Rotta per la creazione di un nuovo grafo
 * 1. Riceve la richiesta con i dati del nuovo grafo (name, description, nodes e edges)
 * 2. Valuta che l'utente abbia l'autorizzazione, cioè checkJwt e che i dati del nuovo grafo siano validi
 * 3. Crea il grafo e i suoi archi nel database e lo restituisce al client
 */
graphRouter.post("/", createGraphChecking, (req: Request, res: Response) => {
  graphController.createGraph(req, res);
});

/**
 * Rotta per ricevere il grafo indicato dall'id
 * 1. Riceve la richiesta e l'id del grafo da ricercare
 * 2. Valuta che l'utente abbia l'autorizzazione, cioè checkJwt e che l'id nel percorso sia valido
 * 3. Restituisce il grafo ricercato
 */
graphRouter.get("/:id", getGraphChecking, (req: Request, res: Response) => {
  graphController.getGraphById(req, res);
});

/**
 * Rotta per eseguire l'algoritmo di Dijkstra su un grafo
 * 1. Riceve il nodo di inizio e di fine del percorso da calcolare
 * 2. Valuta che l'utente abbia l'autorizzazione, cioè checkJwt e che l'id nel percorso e i campi per eseguire (startNode e endNode) siano validi
 * 3. Restituisce il percorso calcolato, con il costo e il tempo di esecuzione
 */
graphRouter.post("/:id/run", runGraphChecking, (req: Request, res: Response) => {
  graphController.runGraph(req, res);
});

/**
 * Rotta per modificare uno o più archi di un grafo
 * 1. Riceve i nuovi valori degli archi da modificare, cioè una lista di valori {id dell'arco, nuovo peso}
 * 2. Valuta che l'utente abbia l'autorizzazione, cioè checkJwt e che i valori di ogni modifica siano validi (edgeId, newWeight)
 * 3. Aggiunge i dati della modifica come nuovo record di UpdateLogs e se il nuovo peso è entro la soglia modifica il peso dell'arco, altrimenti il suo status='pending'
 */
graphRouter.patch("/:id", updateGraphChecking, (req: Request, res: Response) => {
  graphController.updateEdges(req, res);
});

/**
 * Rotta per ricevere la lista di tutte le modifiche su un grafo con la possibilità di filtrare gli entry del log
 * 1. Riceve la richiesta e l'id del grafo su cui lavorare
 * 2. Valuta che l'utente abbia l'autorizzazione, cioè checkJwt e che l'id del grafo e i valori nella querystring (filtro) siano validi
 * 3. Restituisce la lista delle modifiche filtrate in json o csv
 */
graphRouter.get("/:id/log", getGraphLogChecking, (req: Request, res: Response) => {
  graphController.getLog(req, res);
});
