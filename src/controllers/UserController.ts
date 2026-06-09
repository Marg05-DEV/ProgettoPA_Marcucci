import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AppSuccessNames } from "../enums/responseStatus/AppStatusNames";
import { SuccessFactory } from "../status/StatusFactory";
import { SuccessDataStructure } from "../utils/CustomTypes";
import { AppError } from "../status/StatusClasses";

export class UserController {
    private userService: UserService;

    /**
     * Costruttore che inizializza l'attributo contenente l'oggetto della classe UserService
     */
    constructor() {
        console.log("costruttore userController")
        this.userService = new UserService();
        console.log("fine userController")
    }

    /**
     * Metodo del controller per recuperare i dati di un utente dato il suo id. Solo l'utente stesso o un amministratore possono ricevere questi dati
     * @param req oggetto Request che contiene l'id dell'utente di cui recuperare i dati
     * @param res oggetto Response con cui si inviano i dati dell'utente ricercato
     */
    async getUser(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const user = await this.userService.getUser(id);

            const responseData: SuccessDataStructure = {
                userId: user.get("userId"),
                username: user.get("username"),
                email: user.get("email"),
                isAdmin: user.get("isAdmin"),
                qtyToken: user.get("qtyToken")
            }

            SuccessFactory.getStatus(AppSuccessNames.USER_FOUND, res, responseData);
        } catch (err) {
            if (err instanceof AppError) {
                (err as AppError).send(res);
            }
        }
    }
}