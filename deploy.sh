# Check directories needed
mkdir -p ~/app/whatsviz/data/input ~/app/whatsviz/data/output
rm -r ~/app/whatsviz/data/input/*

# Pull latest
git -C repo pull || git clone https://github.com/sid093/whatsviz ~/app/whatsviz
cd ~/app/whatsviz

# Docker build
docker build . -t whatsviz

# Stop existing containers
docker rm -f whatsviz

# Start container in background
docker run -p 8000:8000 -v ~/app/whatsviz/data:/home/app/data -d --restart unless-stopped --name whatsviz whatsviz