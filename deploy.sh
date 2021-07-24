# Check directories needed
mkdir -p ~/app/whatsviz/data/input ~/app/whatsviz/data/output
rm -r ~/app/whatsviz/data/input/*

# Pull latest
docker pull sid093/whatsviz

# Stop existing containers
docker stop whatsviz
docker rm whatsviz

# Start container in background
docker run -p 8000:8000 -v ~/app/whatsviz/data:/home/app/data -d --restart unless-stopped --name whatsviz sid093/whatsviz