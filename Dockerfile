FROM node:8.12-alpine
ENV NODE_PORT=80
COPY . /app
WORKDIR /app
ENTRYPOINT [ "node" ]
CMD ["main.js"]
EXPOSE ${NODE_PORT}