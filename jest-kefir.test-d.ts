import {expectType} from 'tsd'
import Kefir from 'kefir'
import createHelpers from '.'
import { Helpers } from 'kefir-test-utils'

const {extensions, ...helpers} = createHelpers(Kefir)

expectType<jest.ExpectExtendMap>(extensions)
expectType<Helpers>(helpers)
