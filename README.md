# fastify-named-routes

[![npm](https://img.shields.io/npm/v/@gendronb/fastify-named-routes.svg?color=green)](https://www.npmjs.com/package/@gendronb/fastify-named-routes)
[![Build Status](https://travis-ci.com/gendronb/fastify-named-routes.svg?branch=master)](https://travis-ci.com/gendronb/fastify-named-routes)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-green.svg)](https://standardjs.com)
[![Known Vulnerabilpo](https://img.shields.io/snyk/vulnerabilities/github/gendronb/fastify-named-routes.svg?color=green)](https://snyk.io/test/github/gendronb/fastify-named-routes)

This package brings support for named routes to Fastify.

Being able to retrieve route options (`path` in particular) by name can be useful for generating URLs (for emails for example) or redirects (eg. Location header).

## Install
```
npm i @gendronb/fastify-named-routes --save
```

## Usage

First, register the plugin :

```js
const fastify = require('fastify')()
const named-routes = require('fastify-named-routes')

fastify.register(named-routes)

fastify.listen(3000, err => {
  if (err) throw err
  console.log('Server listenting on localhost:', fastify.server.address().port)
})
```

Then register your routes as usual, simply passing a `routeName` property under the `config` key :

```js
fastify.get('/get', { config: { routeName: 'my-route' } }, function (req, reply) {
  reply.send('get')
})
```

Then later in your code :

```js
fastify.post('/create', function (req, reply) {

  let newEntity= // Some business logic to create an entity

  // Retrieve route options by name
  let myRouteOptions = fastify.namedRoutes.get('my-route')
  console.debug(myRouteOptions)
  // Will output :
  // { 
  //   config: { routeName: 'my-route', url: '/get' },
  //   method: 'GET',
  //   url: '/get',
  //   handler: [Function],
  //   path: '/get',
  //   prefix: '',
  //   logLevel: '',
  //   attachValidation: false 
  // }

  reply.status(303).header('Location', `${myRouteOptions.path}/${newEntity.id}`).send('created')
  // If newEntity.id is 1, the location header will be : 'Location: /get/1'
})
```

## How it works

This plugin simply registers a global (app-wide) `onRoute` hook.

The hook will add any route having a `routeName` key (under the route options' `config` key) to a global routes map. Only routes with that specific key will be added to the routes map. 

## Encapsulation and duplicate route name

Since the goal is to have a global (app-wide) routes map, this plugin *does not* support Fastify's encapsulation feature.

Also, if you try to register a route with an existing `routeName`, the plugin will display a warning and the route *will NOT* be added to the map (in effect preserving the previous named route).

## License

MIT