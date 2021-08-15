# Build react ########################################################
FROM node:16-slim as react-builder

WORKDIR /home/app/src/react
COPY src/react/package*.json /home/app/src/react/
RUN npm ci --only=production

# Copy project source code
COPY src/react /home/app/src/react/

# Build react
RUN npm run build


# Build node ########################################################
FROM node:16-slim as node-builder

WORKDIR /home/app/src/node
COPY src/node/package*.json /home/app/src/node/
RUN npm ci --only=production

# Copy project source code
COPY src /home/app/src/


# Build python ########################################################
FROM python:3.8-slim as python-builder

RUN python3 -m venv /opt/venv/pythonapp
ENV PATH="/opt/venv/pythonapp/bin:$PATH"

# Python dependencies
RUN python3 -m pip install --upgrade pip && \
    pip install --no-cache pandas nltk && \
    python3 -c "import nltk; nltk.download('stopwords')"


# Runtime image ####################################################
FROM nikolaik/python-nodejs:python3.8-nodejs16-slim as runtime

# Data volume
RUN mkdir -p /home/app/data/input /home/app/data/output
VOLUME [ "/home/app/data" ]

# Node running port
ENV PORT=8000
EXPOSE 8000

WORKDIR /home/app/src/node

ENV PATH="/opt/venv/pythonapp/bin:$PATH"

# Copy project source code
COPY src /home/app/src/
# Copy build results
COPY --from=python-builder /opt/venv/pythonapp /opt/venv/pythonapp
COPY --from=python-builder /root/nltk_data /root/nltk_data
COPY --from=node-builder /home/app/src/node/node_modules /home/app/src/node/node_modules
COPY --from=react-builder /home/app/src/react/build /home/app/src/node/public

# Start node server
ENTRYPOINT [ "npm", "start" ]