#!/bin/bash
echo "Starting the backend"

cd /home
apt update
apt install -y nodejs
apt install -y npm
apt install -y postgresql
npm install express
npm i
node run migrate