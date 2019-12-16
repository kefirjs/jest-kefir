import {expectType} from 'tsd'
import Kefir from 'kefir'
import './extend-expect'
import {Helpers} from 'kefir-test-utils'

expectType<void>(expect(1).toBeObservable())
expectType<void>(expect(1).toBeProperty())
expectType<void>(expect(1).toBeStream())
expectType<void>(expect(1).toBePool())
expectType<void>(expect(1).toBeActiveObservable())
expectType<void>(expect(1).toEmit([KTU.value('string')], () => {}))
expectType<void>(
  expect(1).toEmitInTime(
    [[10, KTU.value('string')]],
    (tick, clock) => {
      tick(10)
      clock.runAll()
    },
    {reverseSimultaneous: true, timeLimit: 1000}
  )
)
expectType<void>(expect(1).toFlowErrors(new Kefir.Observable()))
expectType<Helpers>(KTU)
