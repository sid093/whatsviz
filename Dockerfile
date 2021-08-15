FROM nikolaik/python-nodejs:python3.8-nodejs16-slim

# Python dependencies
RUN python3 -m pip install --upgrade pip
RUN pip install --no-cache pandas nltk
RUN python3 -c "import nltk; nltk.download('stopwords')"

WORKDIR /home/app/src/node

# Pre-build node
COPY src/node/package*.json /home/app/src/node/
RUN npm install

WORKDIR /home/app/src/react

# Pre-build react
COPY src/react/package*.json /home/app/src/react/
RUN npm install

# Node running port
ENV PORT=8000
EXPOSE 8000

# Copy project source code
COPY src /home/app/src/

# Build react
RUN npm run build
RUN mv /home/app/src/react/build /home/app/src/node/public

WORKDIR /home/app/src/node

# Data volume
RUN mkdir -p /home/app/data/input /home/app/data/output
VOLUME [ "/home/app/data" ]

# Start node server
ENTRYPOINT [ "npm", "start" ]