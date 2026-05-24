FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# To compile Typescript and create dist folder
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]