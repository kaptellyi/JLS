function throttle(fn, limit) {
  let waiting = false
  return (...args) => {
    if (!waiting) {
      fn.apply(this, args)
      waiting = true
      setTimeout(() => {
        waiting = false
      }, limit)
    }
  }
}

export default throttle;