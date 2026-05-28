# Installa l'immagine base di Node
FROM node:lts-alpine3.23

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia il contenuto della root del progetto nella directory di lavoro del container
COPY . .

# Installa le dipendenze del progetto definite nel package.json
RUN npm install

# Compila il progetto TypeScript e memorizza i file JavaScript di output nella cartella dist
RUN npm run build

# Espone la porta su cui il server verrà eseguito
EXPOSE 3000

# Definisce il comando da eseguire all'avvio del container.
# ENTRYPOINT forza l'utente a eseguire npm, mentre CMD fornisce gli argomenti di default a npm, che possono essere sovrascritti all'esecuzione del container.
ENTRYPOINT ["npm"]
CMD ["run", "start"]