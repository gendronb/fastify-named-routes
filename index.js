'use strict'

const fp = require('fastify-plugin')
const Map = require('es6-map')

class NamedRoutes {
  constructor () {
    this.routesMap = new Map([])
  }

  get (name) {
    return this.routesMap.get(name) || null
  }
}

const namedRoutesPlugin = function (fastify, opts, next) {
  let plugin = new NamedRoutes({
    baseUrl: opts.baseUrl
  })

  fastify.decorate('namedRoutes', plugin)

  fastify.addHook('onRoute', (routeOptions) => {
    if (routeOptions.config && routeOptions.config.routeName) {
      let { routeName } = routeOptions.config

      if (plugin.routesMap.has(routeName)) {
        // let existingRoute = plugin.routesMap.get(routeName)
        // onRoute hook is called twice for normal route prefix or when prefixTrailingSlash = 'both',
        // so we should complain ONLY if this is not the case
        // if (!existingRoute.config || !existingRoute.config.url) {
        fastify.log.warn(`Named route '${routeName}' already present, skipping...`)
        // }
      } else {
        fastify.log.info(`Adding named route '${routeName}'`)
        console.debug(routeOptions)
        plugin.routesMap.set(routeName, routeOptions)
        console.debug(plugin.routesMap)
      }
    }
  })

  next()
}

module.exports = fp(namedRoutesPlugin, {
  fastify: '>= 1.6.0',
  name: 'named-routes'
})
