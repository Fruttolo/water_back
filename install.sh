#!/bin/bash
echo "Starting the backend"

cd /home
apt update
apt install -y curl
apt install -y curl software-properties-common
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc
nvm install 20.11.0
nvm use 20.11.0
nvm alias default 20.11.0
apt install -y nodejs
npm i
node run migrate