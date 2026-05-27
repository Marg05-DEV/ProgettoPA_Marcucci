import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const APP_PORT = process.env.APP_PORT || 3000;

app.listen(APP_PORT, () => {
    console.log(`Server running on http://localhost:${APP_PORT}`);
});