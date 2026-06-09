import { UserDAO } from "../dao/UserDAO";
import { User, UserCreationAttributes } from "../models/User";
import { ErrorFactory } from "../status/StatusFactory";
import { AppErrorNames } from "../enums/responseStatus/AppStatusNames";
import { INITIAL_TOKEN_AMOUNT } from "../utils/Const";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";

/**
 * classe AuthService che implementa metodi che si interfacciano con il db 
 * riguardo azioni di autenticazione
 */
export class AuthService {
    private userDao: UserDAO;
    private privateKey: string;

    /**
     * Costruttore del Service che istanzia il DAO da chiamre per agire sul db
     * e recupera la chiave privata dal path nell'env che verrà utilizzata per il login e la registrazione
     */
    constructor() {
        this.userDao = new UserDAO();

        const key_path = process.env.JWT_SECRET_KEY_PATH || "./keys/jwtRS256.key";
        if (!key_path) 
            throw ErrorFactory.getStatus(AppErrorNames.JWT_SECRET_MISSING);

        this.privateKey = fs.readFileSync(key_path).toString();
    }

    /**
     * Metodo che si interfaccia con il db e valuta se le credenziali per il login sono corrette. Se si, dirma il token JWT per eseguire l'accesso
     * @param email stringa contenente l'email dell'utente che deve accedere
     * @param password stringa contenente la password dell'utente
     * @returns oggetto Promise che promette di ritornare il token jwt (string). Se le credenziali non sono corrette verrà lanciato il rispettivo errore di invalidità delle credenziali
     */
    async login(email: string, password: string): Promise<string> {
        const user = await this.checkEmailExist(email)
        if (!user){
            throw ErrorFactory.getStatus(AppErrorNames.INVALID_EMAIL);
        }

        const isMatch = await bcrypt.compare(password.trim(), user.get("password") as string);

        if (!isMatch) {
            throw ErrorFactory.getStatus(AppErrorNames.INVALID_PASSWORD);
        }

        const jwtToken: string = this.signJWT(user);

        return jwtToken;
    }

    /**
     * Metodo che si interfaccia con il db e crea un nuovo utente con le credenziali inserite. Poi, se la creazione va a buon fine, effettua la firma del token JWT per autenticarsi
     * @param email stringa contenente l'email del nuovo utente
     * @param password stringa contenente la password del nuovo utente
     * @param username stringa contenente lo username del nuovo utente
     * @returns oggetto Promise che promette di ritornare il token jwt (string). Se le credenziali del nuovo utente non sono valide verrà lanciato un errore
     */
    async register(email: string, password: string, username: string): Promise<string> {
        const existingUser = await this.checkEmailExist(email)


        if (existingUser){
            throw ErrorFactory.getStatus(AppErrorNames.EMAIL_ALREADY_EXISTS);
        }

        const exixtingUserByUsername: User|null = await this.userDao.getUserByUsername(username.trim());

        if(exixtingUserByUsername) {
            throw ErrorFactory.getStatus(AppErrorNames.USERNAME_ALREADY_EXISTS);
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);

        const newUserData: UserCreationAttributes = {
            username: username.trim(),
            email: email.trim(),
            password: hashedPassword,
            isAdmin: false,
            qtyToken: INITIAL_TOKEN_AMOUNT || 1000
        }

        const user: User|null = await this.userDao.create(newUserData);
        
        const jwtToken: string = this.signJWT(user);

        return jwtToken;
    }

    /**
     * Genera e firma un token JWT per l'utente fornito usando la chiave privata.
     * @param user istanza della classe User dell'utente di cui generare il token
     * @returns stringa contenente il token JWT firmato. Lancia un errore se non viene trovata la chiave privata nel file env
     */
    private signJWT(user: User): string {
        if (!this.privateKey) {
            throw ErrorFactory.getStatus(AppErrorNames.JWT_SECRET_MISSING);
        }


        const jwtToken: string = jwt.sign({ 
                userId: user.get("userId"), 
                email: user.get("email"), 
                isAdmin: user.get("isAdmin") 
            },  
            this.privateKey, 
            {algorithm: "RS256", expiresIn: "1h"});

        return jwtToken;
    }

    /**
     * Metodo che cerca nel database se esiste un utente con l'email indicata
     * @param email stringa contenente l'email da ricercare
     * @returns oggetto Promise che promette di ritornare l'oggetto User ricercato o null se l'email ricercata non è associata a nessun utente
     */
    private async checkEmailExist(email: string): Promise<User|null> {
        const user: User|null = await this.userDao.getUserByEmail(email.trim());

        return user
    }

}