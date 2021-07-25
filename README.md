# dataviz-whatsapp
Node application which uses R based Data Visualization tool for WhatsApp chat

Usage -
```
    docker build . -t whatsviz
    docker run -p 8000:8000 -d --restart unless-stopped --name whatsviz whatsviz
```

One-Click run in Ubuntu 21.04
```
    curl -s https://raw.githubusercontent.com/sid093/whatsviz/master/deploy.sh | bash /dev/stdin 
```