import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Recupera le variabili di ambiente dal file .env
dotenv.config();

const DB_NAME = process.env.POSTGRES_DB || "progetto_pa_db";
const DB_USER = process.env.POSTGRES_USER || "user";
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_HOST = process.env.POSTGRES_HOST || "localhost";

/**
 * Classe per la gestione della connessione al database.
 * Sfrutta il patter Singleton per assicurare che venga creata una sola istanza di connessione durante l'esecuzione dell'applicazione.
 */
export class DBConnection {
    private static instance: DBConnection | null = null; 
    private sequelize: Sequelize;

    private constructor() {
        this.sequelize = new Sequelize(
            DB_NAME, 
            DB_USER, 
            DB_PASSWORD, 
            {
                host: DB_HOST,
                dialect: "postgres"
            }
        );
    }

    /**
     * Funzione per ottenere l'istanza di connessione al database. 
     * Implementa il pattern Singleton: se l'istanza non esiste, la crea; altrimenti, restituisce quella esistente.
     * 
     * @returns {Sequelize} Restituisce l'istanza di Sequelize per la connessione al database. Se l'istanza non esiste, la crea prima di restituirla.
     */
    public static getInstance(): Sequelize {
       
        if(!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }
        return DBConnection.instance.sequelize;
    }
}
