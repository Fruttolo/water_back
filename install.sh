#!/bin/bash
echo "Starting the backend"

cd /home
apt update
apt install -y nodejs
apt install -y npm
npm i
node run migrate