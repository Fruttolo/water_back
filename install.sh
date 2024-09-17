#!/bin/bash
echo "Starting the backend"

cd /home
apt update
apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm i
node run migrate