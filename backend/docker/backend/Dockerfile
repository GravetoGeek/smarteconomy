from node:latest
workdir /backend
copy docker/backend/package.json /backend/
run npm install
copy . /backend
expose 8000
cmd ["npm","run","dev"]
