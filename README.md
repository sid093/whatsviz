# dataviz-whatsapp
Node application which uses Python based Data Visualization tool for WhatsApp chat

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://github.com/sidxdev/whatsviz)

Usage -
```
    docker build . -t whatsviz
    docker run -p 8000:8000 -d --restart unless-stopped --name whatsviz whatsviz
```

Just python script, place chat.txt in test folder -
```
    python src/python/script.py test/chat.txt test/out.txt --no-delete
```

One-Click run in Ubuntu 21.04
```
    curl -s https://raw.githubusercontent.com/sidxdev/whatsviz/main/deploy.sh | bash
```
---
[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg)](https://www.digitalocean.com/?refcode=485d7ff8969d&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)
