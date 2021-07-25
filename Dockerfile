FROM node:16-alpine

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# Node running port
ENV PORT=8000
EXPOSE 8000

WORKDIR /home/app/src/node

# Pre-build node
COPY src/node/package*.json /home/app/src/node
RUN npm install

# Copy project source code
COPY src /home/app/src

# Data volume
RUN mkdir -p /home/app/data/input /home/app/data/output
VOLUME [ "/home/app/data" ]

# Start node server
ENTRYPOINT [ "npm", "start" ]