'use strict'

const test = require('tap').test

const plugin = require('..')

const Fastify = require('fastify')

test('does not support encapsulation', t => {
  t.plan(1)

  const fastify = Fastify({
    logger: {
      level: 'error'
    }
  })

  fastify.register(plugin)

  fastify.get('/request1', { config: { routeName: 'duplicate' } }, function (req, reply) {
    reply.send('request1')
  })

  fastify.register(function (fastify, opts, next) {
    fastify
      .register(plugin)
      .after(err => {
        if (err) { console.log(err) }
        fastify.get('/request2', { config: { routeName: 'duplicate' } }, function (req, reply) {
          reply.send('request2')
        })
      })
    next()
  }, { prefix: '/api' })

  fastify.listen(0, function () {
    t.equal(fastify.namedRoutes.get('duplicate').path, '/request1')
    fastify.server.unref()
  })
})
