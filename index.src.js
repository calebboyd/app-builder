function throwIfHasBeenCalled (fn) {
  if (fn._called) {
    throw new Error('Cannot call next more than once')
  }
  return fn._called = true
}

function throwIfNotFunction (x) {
  if ('function' !== typeof x) {
    throw new TypeError(`${x}, middleware must be a function`)
  }
  return x
}

function noop () {
  return Promise.resolve()
}

function tryInvokeMiddleware (context, middleware, next) {
  try {
    return Promise.resolve(middleware(context, next))
  } catch(error) {
    return Promise.reject(error)
  }
}

function finalize (context, next, step) {
  return next
    ? Promise.resolve(next(context, noop, step))
    : noop()
}

function middlewareReducer (composed, mw) {
  return function (context, nextFn, step = () => context) {
    const next = () => throwIfHasBeenCalled(next) && composed(context, nextFn, step)
    return tryInvokeMiddleware(context, mw, next).then(step)
  }
}

/**
 * Create a function to invoke all passed middleware functions
 * with a single argument and context
 * @param {...Array<Function>} middleware, groups of middleware functions
 * @return {Function} Invoke the middleware pipeline
 */
export function compose (...middleware) {
  return [].concat(...middleware)
    .filter(throwIfNotFunction)
    .reduceRight(middlewareReducer, finalize)
}

export default function () {
  return new AppBuilder
}

export class AppBuilder {

  constructor () {
    this.middleware = []
  }

  build () {
    if (!this.middleware.length) {
      throw new Error('Usage error: must have at least one middleware')
    }
    return compose(this.middleware)
  }

  use (mw) {
    this.middleware.push(throwIfNotFunction(mw))
    return this
  }
}
