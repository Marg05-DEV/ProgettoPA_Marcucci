import { Request, Response } from "express";
import { AdminService } from "../services/AdminService";
import { AppError } from "../status/StatusClasses";
import { SuccessFactory } from "../status/StatusFactory";
import { AppSuccessNames } from "../enums/responseStatus/AppStatusNames";
import { decodeJwt } from "../middleware/UserMiddleware";
import { SuccessDataStructure } from "../utils/CustomTypes";
import { updateStatus } from "../enums/UpdateEdgeStatus";

export class AdminController {
    private adminService: AdminService;

    /**
     * Costruttore che inizializza l'attributo contenente l'oggetto della classe AdminService
     */
    constructor() {
        this.adminService = new AdminService();
    }

    /**
     * Metodo del controller per la ricarica dei token di un utente
     * @param req oggetto Request che contiene i valori utili per effettuare la ricarica (email e qtyToken)
     * @param res oggetto Response con cui invio al client l'esito dell'operazione
     */
    async rechargeToken(req: Request, res: Response) {
        try {
            const { email, qtyToken } = req.body;
            const updatedUser = await this.adminService.rechargeToken(email.trim(), qtyToken);

            const responseData: SuccessDataStructure = {
                        userId: updatedUser.get("userId"),
                        username: updatedUser.get("username"),
                        email: updatedUser.get("email"),
                        isAdmin: updatedUser.get("isAdmin"),
                        qtyToken: updatedUser.get("qtyToken")
                    }

            SuccessFactory.getStatus(AppSuccessNames.TOKENS_RECHARGED, res, responseData);
        } catch (err) {
            if (err instanceof AppError) {
                (err as AppError).send(res);
            }
        }
    }

    /**
     * Metodo del costruttore con cui risolvere una modifica pendente
     * @param req oggetto Request che contiene i valori per risolvere la modifica (updateId e status)
     * @param res oggetto Response con cui inviare al client l'esito dell'operazione
     */
    async updatePending(req: Request, res: Response) {
        try {
            const { updateId, status } = req.body;
            const adminId = decodeJwt(req).userId;
            const updatedUpdateLog = await this.adminService.updatePending(updateId, status, adminId);
            
            const responseData: SuccessDataStructure = {
                        updateId: updatedUpdateLog.get("updateId"),
                        requestedBy: updatedUpdateLog.get("requestedBy"),
                        edgeId: updatedUpdateLog.get("edgeId"),
                        status: updatedUpdateLog.get("status"),
                        oldWeight: updatedUpdateLog.get("oldWeight"),
                        newWeight: updatedUpdateLog.get("newWeight"),
                        resolvedBy: updatedUpdateLog.get("resolvedBy"),
                        requestedAt: updatedUpdateLog.get("requestedAt"),
                        resolvedAt: updatedUpdateLog.get("resolvedAt"),
                    }

            SuccessFactory.getStatus(AppSuccessNames.PENDING_UPDATE_RESOLVED, res, responseData);
        } catch (err) {
            if (err instanceof AppError) {
                (err as AppError).send(res);
            }
        }
    }

    /**
     * Metodo del controller con cui ricevere l'elenco delle modifiche pendenti
     * @param req oggetto Request con cui il client invia la richiesta
     * @param res oggetto Response con cui invio al client la lista delle modifiche pendenti
     */
    async getPending(req: Request, res: Response) {
        try {
            const updatedUpdateLog = await this.adminService.getAllByStatus(updateStatus.PENDING);
            
            // Creiamo un array di SuccessDataaStructure a partire dalla lista di UpdateLog ritornata dall'AdminService
            const updateLogsArray: SuccessDataStructure[] = updatedUpdateLog.map((entry) => ({
                        updateId: entry.get("updateId"),
                        requestedBy: entry.get("requestedBy"),
                        edgeId: entry.get("edgeId"),
                        status: entry.get("status"),
                        oldWeight: entry.get("oldWeight"),
                        newWeight: entry.get("newWeight"),
                        resolvedBy: entry.get("resolvedBy"),
                        requestedAt: entry.get("requestedAt"),
                        resolvedAt: entry.get("resolvedAt"),
                    }));
            
            const  responseData: SuccessDataStructure = {pendingUpdateRequests: updateLogsArray};

            SuccessFactory.getStatus(AppSuccessNames.PENDING_REQUESTS_FOUND, res, responseData);
        } catch (err) {
            if (err instanceof AppError) {
                (err as AppError).send(res);
            }
        }
    }

    /**
     * Metodo del controller con cui cambiare il ruolo di un utente
     * @param req oggetto Request che contiene i valori con cui cambiare il ruolo di un utente (email e isAdmin)
     * @param res oggetto response con cui invio al client l'esito dell'operazione
     */
    async changeRole(req: Request, res: Response) {
        try {
            const { email, isAdmin } = req.body;
            const adminEmail = decodeJwt(req).email;
            const updatedUser = await this.adminService.changeRole(email, isAdmin, adminEmail);

            const responseData: SuccessDataStructure = {
                        userId: updatedUser.get("userId"),
                        username: updatedUser.get("username"),
                        email: updatedUser.get("email"),
                        isAdmin: updatedUser.get("isAdmin"),
                        qtyToken: updatedUser.get("qtyToken")
                    }

            SuccessFactory.getStatus(AppSuccessNames.ROLE_UPDATED, res, responseData);
        } catch (err) {
            if (err instanceof AppError) {
                (err as AppError).send(res);
            }
        }
    }
}