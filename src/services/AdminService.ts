import { UserDAO } from "../dao/UserDAO";
import { User } from "../models/User"
import { UpdateLogDAO } from "../dao/UpdateLogDAO";
import { GraphDAO } from "../dao/GraphDAO";
import { ErrorFactory } from "../status/StatusFactory";
import { AppErrorNames } from "../enums/responseStatus/AppStatusNames";
import { updateStatus } from "../enums/UpdateEdgeStatus";
import { UpdateLog } from "../models/UpdateLog";
import { DBConnection } from "../db/Connection";
import { Edge } from "../models/Edge";
import { EdgeDAO } from "../dao/EdgeDAO";

/**
 * classe AdminService che implementa metodi che si interfacciano con il db 
 * riguardo azioni fatte da un utente con ruolo admin
 */
export class AdminService {
    private userDao: UserDAO;
    private updateLogDao: UpdateLogDAO;
    private graphDao: GraphDAO;
    private edgeDao: EdgeDAO

    /**
     * costruttore del Service che istanzia i DAO da chiamre per agire sul db
     */
    constructor() {
        this.userDao = new UserDAO();
        this.updateLogDao = new UpdateLogDAO();
        this.graphDao = new GraphDAO();
        this.edgeDao = new EdgeDAO();
    }

    /**
     * Metodo che richiama la query dello UserDAO per fare l'update. 
     * Va a modificare il campo qtyToken aggiungendo il numero di token inserito dall'admin
     * @param email email dell'utente a cui vanno ricaricati i token
     * @param amount numero di token da aggiungere all'utente
     * @returns oggetto Promise che promette di ritornare l'oggetto User con i campi aggiornati. In caso di email non associata a nessun utente viene lanciato il rispettivo errore
     */
    async rechargeToken(email: string, amount: number): Promise<User> {
        const user = await this.userDao.getUserByEmail(email);
        if (!user) {
            throw ErrorFactory.getStatus(AppErrorNames.USER_NOT_FOUND);
        }

        const newQty = user.get("qtyToken") as number + amount;
        
        const updatedUser = await this.userDao.update(user.get("userId") as number, { qtyToken: newQty });

        return updatedUser as User;
    }

    /**
     * Metodo che utilizza l'update dello UpdateLogDAO per modificare lo stato di una richiesta pendente. 
     * @param updateId codice identificativo della modifica di cui modificare lo stato
     * @param status stringa indicante il nuovo stato della modifica ('approved' o 'rejected')
     * @param adminId codice identificativo dell'admin che risolve la richiesta di modifica
     * @returns oggetto Promise che promette di ritornare l'oggetto UpdateaLog modificato. Se si evidenziani problemi come la non esistenza dell'updateId nel db o se la richiesta non è in uno stato di 'pending' allora viene lanciato un errore 
     */
    async updatePending(updateId: number, status: string, adminId: number): Promise<UpdateLog> {
        const update = await this.updateLogDao.read(updateId);
        if (!update) {
            throw ErrorFactory.getStatus(AppErrorNames.UPDATE_NOT_FOUND);
        }

        if (update.get("status") !== updateStatus.PENDING) {
            throw ErrorFactory.getStatus(AppErrorNames.UPDATE_NOT_PENDING);
        }

        const sequelize = DBConnection.getInstance();

        const transactionResult = await sequelize.transaction(async (t) => {
        
            // Prima query della transaction: aggiorno i campi in UpdateLog
            const updatedUpdateLog = await this.updateLogDao.update(updateId, {
                status,
                resolvedAt: new Date(),
                resolvedBy: adminId
            }, t);
            
            // In generale faccio gli altri passi solo se la richiesta è stata approvata
            if (status === updateStatus.APPROVED) {
                const edgeId = update.get("edgeId") as number;
                // Seconda query: Recupero l'arco associato all'entry log
                const associatedEdge = await this.edgeDao.read(edgeId, t);
                
                if (!associatedEdge) {
                    throw ErrorFactory.getStatus(AppErrorNames.EDGE_NOT_FOUND);
                }
                
                // Terza query: Aggiorno il peso dell'arco associato all'entry log con il valore memorizzato in newWeight
                await this.edgeDao.update(edgeId, {weight: update.get("newWeight") as number}, t);

                const graphId = associatedEdge.get("graphId") as number;

                // Quarta query: Aggiorno il timestamp updatedAt del grafo associato all'arco associato all'entry log
                await this.graphDao.update(graphId, { updatedAt: new Date() }, t);
            }

            return updatedUpdateLog as UpdateLog;
        });

        return transactionResult as UpdateLog;
    }

    /**
     * Metodo che richiama il metodo getAllByStatus di UpdateLogDao che ritorna una lista di oggetti UpdateLog che hanno attributo status pari al valore del parametro.
     * @param status stringa contenente lo status con cui filtrare gli oggetti UpdateLog
     * @returns oggetto Promise che promette di ritornare una lista di oggeti UpdateLog. 
     */
    async getAllByStatus(status: string): Promise<UpdateLog[]> {
        const logs = await this.updateLogDao.readAllByStatus(status);
        
        console.log(logs)
        return logs as UpdateLog[];
    }

    /**
     * Metodo per assegnare un nuovo ruolo ad un utente. Sfrutta il metodo update() dello UserDAO
     * @param email email dell'utente di cui si vuole modificare il ruolo
     * @param isAdmin valore booleano indicante il nuovo ruolo dell'utente
     * @param adminEmail email dell'admin che sta effettuando l'operazioen di modifica
     * @returns oggetto Promise che promette di ritornare l'oggetto User modificato. Se l'admin vuole modificare il proprio ruolo o l'email ricercata non è presente nel db allora viene lanciato un errore
     */
    async changeRole(email: string, isAdmin: boolean, adminEmail: string): Promise<User> {
        if (email === adminEmail) {
            throw ErrorFactory.getStatus(AppErrorNames.ADMIN_SELF_ROLE_CHANGE);
        }

        const user = await this.userDao.getUserByEmail(email);

        if (!user) {
            throw ErrorFactory.getStatus(AppErrorNames.USER_NOT_FOUND);
        }

        const updatedUser = await this.userDao.update(user.get("userId") as number, { isAdmin });

        return updatedUser as User;
    }
}