FROM node:16-alpine

# Install R
RUN apk add R

# Install R libraries
RUN Rscript -e "install.packages('svglite', repos='http://cran.us.r-project.org')"
RUN Rscript -e "install.packages('tokenizers', repos='http://cran.us.r-project.org')"
RUN Rscript -e "install.packages('stopwords', repos='http://cran.us.r-project.org')"
RUN Rscript -e "install.packages('wordcloud', repos='http://cran.us.r-project.org')"
RUN Rscript -e "install.packages('tidyr', repos='http://cran.us.r-project.org')"
RUN Rscript -e "install.packages('dplyr', repos='http://cran.us.r-project.org')"

# Node running port
ENV PORT=8000
EXPOSE 8000

WORKDIR /home/app/src/node

# Pre-build node
COPY src/node/package*.json /home/app/src/node
RUN npm install

# Copy project source code
COPY src /home/app/src

# Start node server
CMD [ "npm", "start" ]