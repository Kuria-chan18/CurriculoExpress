FROM node:16

# Create app directory
WORKDIR /app

COPY . /app

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

ENV PORT 30
EXPOSE 30
CMD [ "npm", "start" ]
