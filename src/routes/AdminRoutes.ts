import Router from "express";
import { Request, Response } from "express";
import { AdminController } from "../controllers/AdminController";
import { rechargeTokenChecking, pendingChecking, getPendingChecking, changeRoleChecking } from "../middleware/AdminMiddleware";

/**
 * Rotte riguardanti gli utenti admin:
 * - rechargeToken: PATCH /admin/rechargeToken
 * - managePendingRequest: PATCH /admin/pending
 * - changeUserRole: PATCH /admin/changeRole
 * - getPendingRequest: GET /admin/pending
 */

export const adminRouter = Router();
const adminController = new AdminController();

/**
 * Rotta per ricaricare i token ad un utente.
 * 1. Riceve l'email dell'utente a cui eseguire la ricarica e la quantità di token da ricaricare
 * 2. Le passa alla validazione nel middleware
 * 3. Modifica la quantità di token dell'utente
 */
adminRouter.patch("/rechargeToken", rechargeTokenChecking, (req: Request, res: Response) => {
    adminController.rechargeToken(req, res);
});

/**
 * Rotta per risolvere una richiesta di modifica pendente.
 * 1. Riceve l'id della richiesta da risolvere e il nuovo stato della richiesta
 * 2. Le passa alla validazione nel middleware
 * 3. Modifica lo stato della richiesta, il timestamp della risoluzione e l'id dell'admin che ha risolto la richiesta. 
 *    Modifica anche il timestamp dell'ultima modifica del grafo di cui fa parte l'arco da modificare
 */
adminRouter.patch("/pending", pendingChecking, (req: Request, res: Response) => {
    adminController.updatePending(req, res);
});

/**
 * Rotta per ricevere la lista di richieste pendenti.
 * 1. Riceve la richiesta
 * 2. Valuta che l'utente abbia l'autorizzazione, cioè checkAdmin e checkJwt
 * 3. Restituisce la lista di UpdateLogs con status='pending'
 */
adminRouter.get("/pending", getPendingChecking, (req: Request, res: Response) => {
    adminController.getPending(req, res);
});

/**
 * Rotta per cambiare il ruolo di un utente.
 * 1. Riceve l'email dell'utente e il valore booleano per dire se l'utente deve diventare admin (true) o deve tornare un normale utente (false)
 * 2. Le passa alla validazione nel middleware
 * 3. Modifica il ruolo dell'utente
 */
adminRouter.patch("/changeRole", changeRoleChecking, (req: Request, res: Response) => {
    adminController.changeRole(req, res);
});

