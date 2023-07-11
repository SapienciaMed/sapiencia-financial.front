FROM node:14-alpine

RUN node --max_old_space_size=4096
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
EXPOSE 9004
CMD ["npm", "run", "start"]