FROM nikolaik/python-nodejs:python3.8-nodejs16-slim

# Python dependencies
RUN pip install --no-cache --upgrade pandas

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