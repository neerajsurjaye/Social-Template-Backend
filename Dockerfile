FROM debian:buster-slim

RUN apt-get update &&\
    apt-get install curl -y

RUN curl -sL https://deb.nodesource.com/setup_17.x -o /tmp/nodesource_setup.sh &&\
    bash /tmp/nodesource_setup.sh

RUN apt install nodejs -y

RUN apt-get install python3 &&\
    apt-get install python3-pip -y

WORKDIR /app

COPY package*.json .

COPY requirements.txt .

RUN npm install -y

RUN pip3 install --upgrade pip &&\
    pip3 install -r requirements.txt 

ENV PORT=8080

COPY . .

CMD ["npm" , "start"]
