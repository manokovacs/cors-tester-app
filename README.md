# Fake platform and app webservice for CORS request testing 

Tool for testing cors scenarios in order to validate requests. Project runs a `platform` service representing
the service provider that may issue a cookie and can run an `app` that makes cors call to the platform.

User can adjust the cookie type issued, the domains and custom calls can be added into the source-code.


## Setup

### Pointing domain to localhost

Edit `/etc/hosts` and add:

```shell
127.0.0.1 fakeplatform.com
127.0.0.1 app.fakeplatform.com
```
### Config
Domains and ports can be overriden in the `config.json`. If domains are changed,
`hosts` need adjustment.

## Usage
Platform and app can be started using the npm/yarn scripts

```shell
yarn run app &
yarn run platform
```

Use the `/login` url (printed in the terminal) to set the cookie.

### Platform
Starts a service both on `http` and `https` procotol.
The services has two endpoints:
- `/login`: sets `SESS` cookie on the domain of the platform
- `/cors`: exposes minimal cors headers to be called from `app`. It returns `200` if the request is successful and cookie is passed.

### App
Webserver exposes `html`s in `/app` directory
- `embedded.html`: does cors requests to both the `http` and `https` platform URL
- `pulled.html`: Contains a script request to `static/widget.js` that makes the CORS request (not like there is a difference)

Anything else added to `/app` will be available to use.
