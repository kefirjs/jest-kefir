import '../extend-expect'

const {prop, stream, pool, activate, deactivate, value, error, end, send} = KTU

describe('jest-kefir', () => {
  describe('toBeObservable', () => {
    it('should match with stream', () => {
      expect(stream()).toBeObservable()
    })

    it('should match with property', () => {
      expect(prop()).toBeObservable()
    })

    it('should negate with plain object', () => {
      expect({}).not.toBeObservable()
    })
  })

  describe('toBeProperty', () => {
    it('should match with property', () => {
      expect(prop()).toBeProperty()
    })

    it('should negate with stream', () => {
      expect(stream()).not.toBeProperty()
    })

    it('should negate with plain object', () => {
      expect({}).not.toBeProperty()
    })
  })

  describe('toBeStream', () => {
    it('should match with stream', () => {
      expect(stream()).toBeStream()
    })

    it('should negate with property', () => {
      expect(prop()).not.toBeStream()
    })

    it('should negate with plain object', () => {
      expect({}).not.toBeStream()
    })
  })

  describe('toBePool', () => {
    it('should match with pool', () => {
      expect(pool()).toBePool()
    })

    it('should negate with stream', () => {
      expect(stream()).not.toBePool()
    })

    it('should negate with property', () => {
      expect(prop()).not.toBePool()
    })

    it('should negate with plain object', () => {
      expect({}).not.toBePool()
    })
  })

  describe('toBeActiveObservable', () => {
    it('should negate on plain object', () => {
      expect({}).not.toBeActiveObservable()
    })

    it('should negate on inactive stream', () => {
      expect(stream()).not.toBeActiveObservable()
    })

    it('should negate on activated and deactivated stream', () => {
      const a = stream()
      activate(a)
      deactivate(a)
      expect(a).not.toBeActiveObservable()
    })

    it('should match on active stream', () => {
      const a = stream()
      activate(a)
      expect(a).toBeActiveObservable()
    })

    it('should match on active stream when called as method', () => {
      const a = stream()
      activate(a)
      expect(a).toBeActiveObservable()
    })

    it('should negate on inactive property', () => {
      expect(prop()).not.toBeActiveObservable()
    })

    it('should match on active property', () => {
      const a = prop()
      activate(a)
      expect(a).toBeActiveObservable()
    })

    it('should negate on activated and deactivated property', () => {
      const a = prop()
      activate(a)
      deactivate(a)
      expect(a).not.toBeActiveObservable()
    })
  })

  describe('toEmit', () => {
    it('should match on stream event', () => {
      const a = stream()
      expect(a).toEmit([value(1)], () => {
        send(a, [value(1)])
      })
    })

    it('should match on stream error', () => {
      const a = stream()
      expect(a).toEmit([error(1)], () => {
        send(a, [error(1)])
      })
    })

    it('should match on stream end', () => {
      const a = stream()
      expect(a).toEmit([end()], () => {
        send(a, [end()])
      })
    })

    it('should match events when stream is active', () => {
      const a = stream()
      expect(a).toEmit([end()], () => {
        send(a, [end(), value(1)])
      })
    })

    it('should match current event', () => {
      const a = prop()
      send(a, [value(1)])
      expect(a).toEmit([value(1, {current: true})])
    })

    it('should match current end', () => {
      const a = prop()
      send(a, [end()])
      expect(a).toEmit([end({current: true})])
    })

    it('should not match when stream emits too many events', () => {
      const a = stream()
      expect(a).not.toEmit([value(1), end()], () => {
        send(a, [value(1), value(2), end()])
      })
    })

    it('should not match when stream emits too few events', () => {
      const a = stream()
      expect(a).not.toEmit([value(1), end()], () => {
        send(a, [end()])
      })
    })
  })

  describe('toEmitInTime', () => {
    it('should emit into stream over time', () => {
      const a = stream()
      expect(a.delay(10)).toEmitInTime(
        [
          [10, value(1)],
          [10, value(2)],
          [20, value(3)],
        ],
        (tick) => {
          send(a, [value(1), value(2)])
          tick(10)
          send(a, [value(3)])
        }
      )
    })

    it('should emit into stream over time in reverse', () => {
      const a = stream()
      expect(a.delay(10)).toEmitInTime(
        [
          [10, value(1)],
          [10, value(2)],
          [20, value(3)],
          [20, value(4)],
          [20, value(5)],
        ],
        (tick) => {
          send(a, [value(1), value(2)])
          tick(10)
          send(a, [value(3), value(4), value(5)])
        },
        {reverseSimultaneous: true}
      )
    })

    it('should pass clock to callback', () => {
      const a = stream()
      expect(a.delay(10)).toEmitInTime([[10, value(1)]], (tick, clock) => {
        send(a, [value(1)])
        clock.runToLast()
      })
    })

    it('should uninstall clock if callback throws', () => {
      const a = stream()
      const origSetTimeout = setTimeout
      const err = new Error('sucks to be you!')
      try {
        expect(a).toEmitInTime([], () => {
          throw err
        })
      } catch (e) {
        expect(e).toBe(err)
      } finally {
        expect(origSetTimeout).toBe(setTimeout)
      }
    })
  })

  describe('toFlowErrors', () => {
    it('should match when errors flow through stream', () => {
      const a = stream()

      expect(a).toFlowErrors()
    })

    it('should throw when errors do not flow through stream', () => {
      expect(() => {
        const a = stream()

        expect(a).not.toFlowErrors()
      }).toThrow()
    })

    it('should negate when errors do not flow through stream', () => {
      const a = stream()

      expect(a.ignoreErrors()).not.toFlowErrors(a)
    })

    it('should throw when errors flow through stream', () => {
      expect(() => {
        const a = stream()

        expect(a.ignoreErrors()).toFlowErrors(a)
      }).toThrow()
    })

    it('should match when errors flow through property', () => {
      const a = prop()

      expect(a).toFlowErrors()
    })

    it('should throw when errors do not flow through property', () => {
      expect(() => {
        const a = prop()

        expect(a).not.toFlowErrors()
      }).toThrow()
    })

    it('should negate when errors do not flow through property', () => {
      const a = prop()

      expect(a.ignoreErrors()).not.toFlowErrors(a)
    })

    it('should throw when errors flow through property', () => {
      expect(() => {
        const a = prop()

        expect(a.ignoreErrors()).toFlowErrors(a)
      }).toThrow()
    })
  })
})
