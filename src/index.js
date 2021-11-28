import createTestHelpers from 'kefir-test-utils'

const noop = () => {}

export default function jestKefir(Kefir) {
  const helpers = createTestHelpers(Kefir)
  const {activate, deactivate, error, send, watch, watchWithTime, withFakeTime} = helpers

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

      const options = {
        comment: 'Emitted values',
        isNot: this.isNot,
        promise: this.promise,
      }
      const pass = this.equals(log, expected)
      const message = pass
        ? () =>
            this.utils.matcherHint('toEmit', undefined, undefined, options) +
            '\n\n' +
            `Expected: not ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(log)}`
        : () => {
            const diffString = this.utils.diff(expected, log, {
              expand: this.expand,
            })
            return (
              this.utils.matcherHint('toEmit', undefined, undefined, options) +
              '\n\n' +
              (diffString && diffString.includes('- Expect')
                ? `Difference:\n\n${diffString}`
                : `Expected: ${this.utils.printExpected(expected)}\n` + `Received: ${this.utils.printReceived(log)}`)
            )
          }

      return {
        pass,
        message,
      }
    },

    toEmitInTime(received, expected, cb = noop, {timeLimit = 10000, reverseSimultaneous = false} = {}) {
      let log,
        unwatch = null

      withFakeTime((tick, clock) => {
        // prettier-ignore
        ({log, unwatch} = watchWithTime(received))
        cb(tick, clock)
        tick(timeLimit)
      }, reverseSimultaneous)
      unwatch()

      const options = {
        comment: 'Emitted values',
        isNot: this.isNot,
        promise: this.promise,
      }
      const pass = this.equals(log, expected)
      const message = pass
        ? () =>
            this.utils.matcherHint('toEmitInTime', undefined, undefined, options) +
            '\n\n' +
            `Expected: not ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(log)}`
        : () => {
            const diffString = this.utils.diff(expected, log, {
              expand: this.expand,
            })
            return (
              this.utils.matcherHint('toEmitInTime', undefined, undefined, options) +
              '\n\n' +
              (diffString && diffString.includes('- Expect')
                ? `Difference:\n\n${diffString}`
                : `Expected: ${this.utils.printExpected(expected)}\n` + `Received: ${this.utils.printReceived(log)}`)
            )
          }

      return {
        pass,
        message,
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

  return {
    ...helpers,
    extensions,
  }
}
