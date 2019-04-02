'use strict'

const test = require('tap').test

const plugin = require('..')

const Fastify = require('fastify')

test('only adds named routes', t => {
  t.plan(2)

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
    // This route was added
    t.ok(fastify.namedRoutes.get('request1'))

    // This route was NOT added
    t.notOk(fastify.namedRoutes.get('request2'))

    fastify.server.unref()
  })
})
