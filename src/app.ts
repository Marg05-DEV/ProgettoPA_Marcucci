import express from 'express';
import { authRouter } from './routes/AuthRoutes';
import { adminRouter } from "./routes/AdminRoutes";
import { graphRouter } from "./routes/GraphRoutes";
import { userRouter } from './routes/UserRoutes';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './status/StatusClasses';
import { DBConnection } from './db/Connection';
import dotenv from 'dotenv';
import { initModels } from './models/init-models';

dotenv.config();


initModels(DBConnection.getInstance());

const app = express();

app.use(express.json());

// rotta iniziale
app.get('/', (_, res) => {
    res.send('Effettuare il login o la registrazione per accedere alle funzionalità! ');
});

// import delle rotte di autenticazione
app.use("/auth", authRouter);

// import delle rotte dell'admin
app.use("/admin", adminRouter);

// import delle rotte sui grafi
app.use("/graphs", graphRouter);

// import delle rotte sull'utente
app.use("/users", userRouter);

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    err.send(res); 
  }
  else{
    console.log(err)
  }
});

export default app;