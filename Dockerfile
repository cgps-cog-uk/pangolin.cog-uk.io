FROM node:lts-alpine AS Build
ARG REPO_USER
ARG REPO_TOKEN
RUN apk add --update bash git python make g++
ENV npm_config_unsafe_perm=true
RUN npm config set unsafe-perm true && npm install -g npm@6.13.7

RUN git config --global url.https://$REPO_USER:$REPO_TOKEN@gitlab.com/cgps/cgps-user-accounts.insteadOf https://gitlab.com/cgps/cgps-user-accounts
RUN git config --global url.https://$REPO_USER:$REPO_TOKEN@gitlab.com/.insteadOf git://gitlab.com/
RUN git config --global url.https://$REPO_USER:$REPO_TOKEN@gitlab.com/cgps.insteadOf git@gitlab.com:cgps
RUN git config --global url.https://$REPO_USER:$REPO_TOKEN@gitlab.com/cgps/.insteadOf ssh://git@gitlab.com/cgps/

COPY ./ /opt/coguk/

WORKDIR /opt/coguk
RUN npm install

WORKDIR /opt/coguk
RUN API_URL_BROWSER=/ \
    API_URL=localhost:3000 \
    npm run build

FROM node:lts-alpine
WORKDIR /opt/coguk/
CMD [ "npm", "start" ]
COPY --from=Build /opt/coguk/ /opt/coguk/
