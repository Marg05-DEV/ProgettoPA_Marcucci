import Router from "express";
import { Response, Request } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateLogin, validateRegister} from "../middleware/AuthMiddleware";

/**
 * Rotte per l'autenticazione:
 * - login: POST /auth/login
 * - registrazione: POST /auth/register
 */

export const authRouter = Router();
const authController = new AuthController();

/**
 * Rotta per il login. 
 * 1. Riceve le credenziali (email e password)
 * 2. Le passa alla validazione nel middleware 
 * 3. Genera il token JWT di autenticazione
 */
authRouter.post("/login", validateLogin, (req: Request, res: Response) => {
    authController.login(req, res);
});


/**
 * Rotta per la registrazione. 
 * 1. Riceve le credenziali (username, email e password)
 * 2. Le passa alla validazione nel middleware 
 * 4. Aggiunge il nuovo utente al database
 * 3. Genera il token JWT di autenticazione effetuando il login
 */
authRouter.post("/register", validateRegister, (req: Request, res: Response) => {
    authController.register(req, res);
});

