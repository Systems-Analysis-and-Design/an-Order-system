# PR
#
# VERSION 1.0.0

FROM node:latest

RUN mkdir -p /app-pr/src
WORKDIR /app-pr/src

COPY . /app-pr/src
RUN cd /app-pr/src; npm install

EXPOSE 3000

RUN curl "mongo:27017"