WHATSVIZ_APP_HOME=~/app/whatsviz
WHATSVIZ_GIT_REPO=https://github.com/sid093/whatsviz

# Pull latest
cd ~
rm -rf $WHATSVIZ_APP_HOME
git clone $WHATSVIZ_GIT_REPO $WHATSVIZ_APP_HOME
cd $WHATSVIZ_APP_HOME

# Check directories needed
mkdir -p $WHATSVIZ_APP_HOME/data/input $WHATSVIZ_APP_HOME/data/output
rm -r $WHATSVIZ_APP_HOME/data/input/*

# Docker build
docker build . -t whatsviz

# Stop existing containers
docker rm -f whatsviz

# Start container in background
docker run -p 8000:8000 -v $WHATSVIZ_APP_HOME/data:/home/app/data -d --restart unless-stopped --name whatsviz whatsviz
