module.exports.appsList = [
    {
        header: 'Hello World',
        description: 'A hello world UI application made with react.',
        image: 'https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_960_720.png',
        path: '/helloworld'
    },
    {
        header: 'Whatsviz',
        description: 'Whatsapp chat visualization.',
        image: 'https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_960_720.png',
        path: '/whatsviz',
        query: '/:id?',
        server: process.env.REACT_APP_WHATSVIZ_SERVER || ''
    }
]

module.exports.appsList.get = function (header) {
    return this.find(e => e.header === header);
}

module.exports.appsList.route = function (appName) {
    const app = this.get(appName);
    return app.path + (app.query ? app.query : '');
}