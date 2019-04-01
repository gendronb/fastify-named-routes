'use strict'

const fp = require('fastify-plugin')

class NamedRoutes {
  constructor ({ baseUrl }) {
    this.baseUrl = baseUrl || null
    this.routesMap = new Map([])
  }

  get (name) {
    return this.routesMap.get(name) || null
  }
}

const namedRoutesPlugin = async function (fastify, opts) {
  let instance = new NamedRoutes({
    baseUrl: opts.baseUrl
  })

  fastify.addHook('onRoute', (routeOptions) => {
    if (routeOptions.config && routeOptions.config.routeName) {
      let { routeName } = routeOptions.config

      if (instance.routesMap.has(routeName)) {
        console.warn(`Named route ${routeName} already present, skipping...`)
      } else {
        console.info(`Adding named route => ${routeName}`)
        instance.routesMap.set(routeName, routeOptions)
      }
    }
  })

  fastify.decorate('namedRoutes', instance)
}

module.exports = fp(namedRoutesPlugin, {
  fastify: '>= 1.6.0',
  name: 'named-routes'
})
