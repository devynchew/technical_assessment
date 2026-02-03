FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# 'serve' is a static file server
RUN npm install -g serve 
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]