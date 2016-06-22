FROM mhart/alpine-node:6.2.2

RUN apk add --no-cache bash git

WORKDIR /src
COPY . /src

RUN npm install

EXPOSE 8080
CMD [ "npm", "run", "start:prod" ]
