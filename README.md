# Whatsviz
React application to visualize WhatsApp chats. Data processing done using Python.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/sidxdev/whatsviz)

Usage -
```
    docker build . -t whatsviz
    docker run -p 8000:8000 -d --restart unless-stopped --name whatsviz whatsviz
```

Just python script, place chat.txt in test folder -
```
    python src/python/script.py test/chat.txt test/out.txt --no-delete
```
