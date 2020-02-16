FROM rocker/tidyverse

WORKDIR /home/app

# Install libraries
RUN Rscript -e "install.packages('svglite')"
RUN Rscript -e "install.packages('tokenizers')"
RUN Rscript -e "install.packages('stopwords')"
RUN Rscript -e "install.packages('wordcloud')"

COPY . .

CMD Rscript script.R ${FILE}