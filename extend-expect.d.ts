declare namespace jest {
  interface Matchers<R, T> {
    toBeObservable(): R
    toBeProperty(): R
    toBeStream(): R
    toBePool(): R
    toBeActiveObservable(): R
    toEmit<V, E>(events: import('kefir-test-utils').Event<V, E>[], cb?: () => void): R
    toEmitInTime<V, E>(
      events: import('kefir-test-utils').EventWithTime<V, E>[],
      cb?: (tick: (s: number) => void, clock: import('lolex').Clock) => void,
      opts?: {reverseSimultaneous?: boolean; timeLimit?: number}
    ): R
    toFlowErrors<V, E>(source?: import('kefir').Observable<V, E>): R
  }
}

declare var KTU: import('kefir-test-utils').Helpers
