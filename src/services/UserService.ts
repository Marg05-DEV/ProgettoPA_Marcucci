import { UserDAO } from "../dao/UserDAO";
import { User } from "../models/User";
import { ErrorFactory } from "../status/StatusFactory";
import { AppErrorNames } from "../enums/responseStatus/AppStatusNames";

/**
 * classe UserService che implementa metodi che si interfacciano con il db 
 * riguardo azioni sugli utenti
 */
export class UserService {
    private userDao: UserDAO;

    /**
     * costruttore del Service che istanzia il DAO da chiamre per agire sul db
     */
    constructor() {
        this.userDao = new UserDAO();

    }

    /**
     * Metodo per recuperare i dati di un utente a partire dal loro id
     * @param id number contenente l'id dell'utente da ricercare
     * @returns oggetto Promise che promette di ritornare un oggetto User con i dati dell'utente ricercato. Viene lanciato un errore se l'utente non è presente sul db
     */
    async getUser(id: number): Promise<User> {
        const user = await this.userDao.read(id);
        
        if (!user) { // user non trovato nel db
            throw ErrorFactory.getStatus(AppErrorNames.USER_NOT_FOUND);
        }
        return user;
    }
}