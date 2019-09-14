FROM node:8

# Create app directory
WORKDIR /usr/src/app
RUN mkdir logs

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .
RUN rm -f .env

EXPOSE 3001

CMD [ "npm", "run","start" ]
