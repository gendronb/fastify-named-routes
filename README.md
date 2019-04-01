# fastify-named-routes

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This package adds support for named routes support to Fastify

## Install
```
npm i @gendronb/fastify-named-routes --save
```

## Usage

TDB

```js
const fastify = require('fastify')()
const named-routes = require('fastify-named-routes')

fastify.register(named-routes)

fastify.listen(3000, err => {
  if (err) throw err
  console.log('Server listenting on localhost:', fastify.server.address().port)
})
```

## How it works

## License

MIT