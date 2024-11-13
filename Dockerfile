FROM node:slim

WORKDIR /app

COPY package*.json ./

RUN npm i 

COPY . .
# ENV MONGODB_URL=MONGODB_URL
EXPOSE 8000
# ENV PORT=8000

CMD [ "npm","run","dev" ]

