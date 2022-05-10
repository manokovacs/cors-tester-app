const Koa = require('koa');
const http = require('http');
const https = require('https');
const logger = require('koa-logger')
const serve = require('koa-static')
const fs = require('fs')
const Router = new require('@koa/router');
const config = require("./config.json");
const router = new Router();
const app = new Koa();
app.use(logger())
app.use(serve('./app'));

app
.use(router.routes())
.use(router.allowedMethods());
console.log("Starting server")
fs.readdir("./app", (err, files) => {
  if (err) {
    return console.log('Unable to scan app directory: ' + err);
  }
  files.forEach(function (file) {
    console.log("           http://" + config.app.domain + ":" + config.app.httpPort + "/"+file);
  });
})

http.createServer(app.callback()).listen(config.app.httpPort);
