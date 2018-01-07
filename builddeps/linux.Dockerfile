FROM node:6

WORKDIR /opt/builder
COPY build build
COPY builddeps builddeps
COPY src src

RUN apt-get install -y rpmbuild \
  && npm i -g electron-installer-redhat

VOLUME [ "/opt/builder/dist" ]

CMD electron-installer-redhat --src build/nodedb-linux-x64 --dest dist/ --arch x86_64 --config ./builddeps/rpm-config.json
