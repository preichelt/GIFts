FROM mhart/alpine-node:5.9.1

RUN apk add --no-cache bash git

WORKDIR /src
COPY . /src

RUN chmod 755 ./script/production/start

RUN npm install

EXPOSE 8080
CMD [ "./script/production/start" ]
