export default function GenAction(generator) {
  const _gen = generator()
  let _aborted = false

  function _error(error) {
    if (_aborted) {
      return
    }
    _next(_gen.throw(error))
  }

  function _next(result) {
    if (_aborted) {
      return
    }

    if (!result) {
      result = _gen.next()
    }

    if (result.done) {
      return
    }

    if (result.value instanceof Promise) {
      result.value.then(() => _next(), (error) => _error(error))
    } else {
      _next()
    }
  }

  this.abort = function() {
    _aborted = true
  }

  this.start = function() {
    _next()
  }
}
