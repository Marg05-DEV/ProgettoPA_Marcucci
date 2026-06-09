import { IDao } from "./IDao";
import { User, UserCreationAttributes } from "../models/User";
import { AppError } from "../status/StatusClasses";
import { AppErrorNames } from "../enums/responseStatus/AppStatusNames";

export class UserDAO implements IDao<User> {

    /**
     * Crea un nuovo utente nel database
     * @param item Oggetto avente come attributi quelli del nuovo utente da creare
     * @returns Un oggetto Promise che se viene risolta restituisce l'oggetto User creato, altrimenti viene lanciato un errore se la creazione non va a buon fine.
     */
    async create(item: UserCreationAttributes): Promise<User> {
        try {
            return await User.create(item);
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Ricerca un singolo utente nel database tramite il suo id
     * @param id Il valore dell'id, campo identificativo univoco da ricercare nel database
     * @returns Un oggetto Promise che se risolta restituisce l'oggetto User ricercato tramite l'id, altrimenti restituisce null se l'oggetto non viene trovato o potrebbe essere lanciato un errore se la richiesta non va a buon fine.
     */
    async read(id: number): Promise<User | null> {
        try {
            return await User.findByPk(id);
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Ricerca di tutti gli utenti presenti nel database
     * @returns Un oggetto promise che se risolta restituisce un array di oggetti User, altrimenti potrebbe esser lanciato un errore se al richiesta non va a buon fine. 
     * Se non sono presenti utenti nel database, l'array restituito è vuoto. 
     */
    async readAll(): Promise<User[]> {
        try {
            return await User.findAll();
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Aggiorna i valori di una parte degli attributi di un utente presente nel database.
     * @param itemId id dell'utente da aggiornare,
     * @param newData Insieme dei nuovi valori con cui aggiornare gli attributi dell'utente da modificare
     * @returns Un oggetto Promise che se risolta restituisce l'oggetto User modificato, altrimenti restituisce null se l'utente da aggiornare non viene trovato o viene lanciato un errore se la richiesta non va a buon fine.
     */
    async update(itemId: number, newData?: Partial<User> | undefined): Promise<User | null> {
        try {
            //aggiungere transizione?
            const user = await User.findByPk(itemId);
            if (!user) return null;
            return await user.update(newData ?? {});
        } catch (err) {
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

    /**
     * Ricerca un singolo utente nel database tramite la sua email
     * @param id Il valore dell'email, campo univoco da ricercare nel database
     * @returns Un oggetto Promise che se risolta restituisce l'oggetto User ricercato tramite email, altrimenti restituisce null se l'oggetto non viene trovato o potrebbe essere lanciato un errore se la richiesta non va a buon fine.
     */
    async getUserByEmail(email: string): Promise <User | null> {
        try {
            return await User.findOne({where: {email} });
        } catch(err) { 
            console.error("Errore reale nel DAO:", err);
            throw new AppError(AppErrorNames.INTERNAL_ERROR)
        }
    }

    /**
     * Ricerca un singolo utente nel database tramite il suo username
     * @param username Il valore dello username da ricercare nel database
     * @returns Un oggetto Promise che se risolta restituisce l'oggetto User, altrimenti null se l'oggetto non viene trovato o potrebbe essere lanciato un errore.
     */
    async getUserByUsername(username: string): Promise<User | null> {
        try {
            return await User.findOne({ where: { username } });
        } catch (err) {
            console.error("Errore reale nel DAO (getUserByUsername):", err);
            throw new AppError(AppErrorNames.INTERNAL_ERROR);
        }
    }

}