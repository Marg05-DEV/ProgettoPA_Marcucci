import Router from "express";
import { Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import { getUserChecking } from "../middleware/UserMiddleware";

/**
 * Rotte riguardanti gli utenti:
 * - getUser: GET /users/:id
 */

export const userRouter = Router();
const userController = new UserController();

/**
 * Rotta per ricevere i dati di un utente.
 * 1. Prende l'id dell'utente inserito come path variable
 * 2. Lo passa al middleware per verificare che la richiesta è arrivata da un admin o dall'utente stesso (utente autenticato)
 * 3. Restituisce i dati dell'utente
 */
userRouter.get("/:id", getUserChecking, (req: Request, res: Response) => {
  userController.getUser(req, res);
});