const Koa = require('koa');
const fs = require('fs');
const http = require('http');
const https = require('https');
const logger = require('koa-logger')
const serve = require('koa-static')
const Router = new require('@koa/router');
const router = new Router();
const app = new Koa();
const config = require('./config.json');
app.use(logger())
app.use(serve('./static'));

router.get('/login', (ctx, next) =>{
  console.log("login")
  ctx.cookies.set("SESS", "token123", {
    domain: config.platform.domain,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    httpOnly: config.cookie.httpOnly,
  })
  ctx.body="logged in"
  next()
})



router.all(config.platform.corsEndpointPath, (ctx, next) =>{
  console.log("cors stuff")
  ctx.set( {
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-origin": "http://"+config.app.domain+":"+config.app.httpPort
  })
  if(ctx.cookies.get('SESS') == "token123"){
    ctx.body="success"
  } else {
    ctx.status=401
  }
  next()
})




app
.use(router.routes())
.use(router.allowedMethods());
console.log("Starting server")
console.log("Login URL: https://"+config.platform.domain+":"+config.platform.httpsPort+"/login")
console.log("           http://"+config.platform.domain+":"+config.platform.httpsPort+"/login")
console.log("CORS URL:  https://"+config.platform.domain+":"+config.platform.httpsPort+config.platform.corsEndpointPath)
console.log("           http://"+config.platform.domain+":"+config.platform.httpsPort+config.platform.corsEndpointPath)


http.createServer(app.callback()).listen(config.platform.httpPort);
https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app.callback()).listen(config.platform.httpsPort);
