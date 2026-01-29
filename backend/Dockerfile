# Dockerfile

FROM debian:11

ENV COMPOSER_ALLOW_SUPERUSER=1
ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

#WORKDIR /root

# git, unzip & zip are for composer

RUN apt-get update -qq && apt-get upgrade -yqq && apt-get install -yqq build-essential curl wget procps && \
      curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && \
      apt-get update -qq && apt-get install -yqq nodejs && \
      npm update -g npm && \
      apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /app

COPY app/package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY app/ ./

EXPOSE 4000
CMD ["npm", "start"]
#ENTRYPOINT ["npm", "start"]

STOPSIGNAL SIGWINCH