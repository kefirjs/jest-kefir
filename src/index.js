import createTestHelpers from 'kefir-test-utils'

const noop = () => {}

export default function jestKefir(Kefir) {
  const {
    prop,
    stream,
    pool,
    activate,
    deactivate,
    send,
    value,
    error,
    end,
    watch,
    withFakeTime,
    watchWithTime,
  } = createTestHelpers(Kefir)

  const extensions = {
    toBeObservable(received) {
      return {
        pass: received instanceof Kefir.Observable,
        message: () => `expected ${received} to be an instance of Kefir.Observable`,
      }
    },

    toBeProperty(received) {
      return {
        pass: received instanceof Kefir.Property,
        message: () => `expected ${received} to be an instance of Kefir.Property`,
      }
    },

    toBeStream(received) {
      return {
        pass: received instanceof Kefir.Stream,
        message: () => `expected ${received} to be an instance of Kefir.Stream`,
      }
    },

    toBePool(received) {
      return {
        pass: received instanceof Kefir.Pool,
        message: () => `expected ${received} to be an instance of Kefir.Pool`,
      }
    },

    toBeActiveObservable(received) {
      return {
        pass: !!received._active,
        message: () => `expected ${received} to be an active observable`,
      }
    },

    toEmit(received, expected, cb = noop) {
      const {log, unwatch} = watch(received)
      cb()
      unwatch()

      return {
        pass: this.equals(log, expected),
        message: () => `expected Observable to emit matching values`,
      }
    },

    toEmitInTime(received, expected, cb = noop, {timeLimit = 10000, reverseSimultaneous = false} = {}) {
      let log = null

      withFakeTime((tick, clock) => {
        log = watchWithTime(received)
        cb(tick, clock)
        tick(timeLimit)
      }, reverseSimultaneous)

      return {
        pass: this.equals(log, expected),
        message: () => `expected Observable to emit matching values with time`,
      }
    },

    toFlowErrors(received, source = received) {
      const expected = [error(-2), error(-3)]

      if (received instanceof Kefir.Property) {
        activate(received)
        send(source, [error(-1)])
        deactivate(received)
        expected.unshift(error(-1, {current: true}))
      }

      const {log, unwatch} = watch(received)
      send(source, [error(-2), error(-3)])
      unwatch()

      return {
        pass: this.equals(log, expected),
        message: () => `expected errors to flow`,
      }
    },
  }

  return {extensions, prop, stream, pool, activate, deactivate, send, value, error, end}
}
