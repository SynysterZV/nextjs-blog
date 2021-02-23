const { createServer } = require('https')
const http = require('http')
const { parse } = require('url')
const { readFileSync } = require('fs')
const next = require('next')

const ports = {
    http: 80,
    https: 443
}
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev });
const handle = app.getRequestHandler()

const httpsOptions = {
    key: readFileSync('C:/Certbot/live/adnauseam.xyz/privkey.pem'),
    cert: readFileSync('C:/Certbot/live/adnauseam.xyz/fullchain.pem')
}

app.prepare()
    .then(() => {
        createServer(httpsOptions, (req, res) => {
            const parsedURL = parse(req.url, true)
            handle(req, res, parsedURL)
        }).listen(ports.https, err => {
            if (err) throw err;
            console.log('HTTPS Ready!')
        })

        http.createServer((req, res) => {
            const parsedURL = parse(req.url, true)
            handle(req, res, parsedURL)
        }).listen(ports.http, err => {
            if(err) throw err
            console.log('HTTP Ready!')
        })
    })