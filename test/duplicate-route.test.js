'use strict'

const test = require('tap').test

const plugin = require('..')

const Fastify = require('fastify')

test('does not overwrite previous named routes', t => {
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

  fastify.get('/request2', { config: { routeName: 'duplicate' } }, function (req, reply) {
    reply.send('request2')
  })

  fastify.listen(0, function () {
    // The first route was not overwritten by the second ones
    t.equal(fastify.namedRoutes.get('duplicate').path, '/request1')
    fastify.server.unref()
  })
})
