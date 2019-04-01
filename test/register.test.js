'use strict'

const test = require('tap').test

const plugin = require('../')

const Fastify = require('fastify')

test('register only named routes', t => {
  t.plan(1)

  const fastify = Fastify({
    logger: {
      level: 'error'
    }
  })
  fastify.register(plugin)

  // register named route using shorthand notation
  fastify.get('/request1', { config: { routeName: 'request1' } }, function (req, reply) {
    reply.send('request1')
  })

  // register named route using full declaration
  fastify.route({
    method: 'GET',
    url: '/request2',
    schema: {
      response: {
        200: {
          type: 'string'
        }
      }
    },
    handler: function (request, reply) {
      reply.send('request2')
    }
  })

  fastify.listen(0, function () {
    t.ok(true)
    fastify.server.unref()
  })
})
