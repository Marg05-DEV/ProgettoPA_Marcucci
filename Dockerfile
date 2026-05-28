# Install  base image of node
FROM node:lts-alpine3.23

# Set the work directory in the container
WORKDIR /app

# Copy project root content into container work directory
COPY . .

# Install project dependencies defined in package.json
RUN npm install

# Compile Typescript project and send output JavaScript files to dist folder
RUN npm run build

# Expose the port on which the server will run
EXPOSE 3000

# Define the command to run when starting the container. 
# ENTRYPOINT force the user to run npm, while CMD provides the default arguments to npm, which can be overwritten when running the container.
ENTRYPOINT ["npm"]
CMD ["run", "start"]