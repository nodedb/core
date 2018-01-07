FROM ubuntu:16.04

ARG NODE_VERSION=6.12.3

WORKDIR /opt/builder
COPY builddeps builddeps

RUN apt-get update \
  && apt-get install -y build-essential curl rpm \
  && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
  && apt-get install -y nodejs \
  && node --version \
  && npm --version \
  && npm i -g electron-installer-redhat electron-installer-debian

VOLUME /opt/builder/build /opt/builder/dist

CMD make -f builddeps/Makefile linux
