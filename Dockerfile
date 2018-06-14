# PR
#
# VERSION 1.0.0

FROM node:latest

RUN mkdir -p /pr/src
WORKDIR /pr/src

COPY . /pr/src
RUN cd /pr/src; npm install


EXPOSE 3000
CMD ["npm", "start"]