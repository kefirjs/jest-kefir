import {Observable, Stream, Property} from 'kefir'
import {Helpers as KHelpers, Event} from 'kefir-test-utils'
import {Clock} from 'lolex'

export interface Helpers extends KHelpers {
  extensions: jest.ExpectExtendMap
}

export interface HelpersFactory {
  (Kefir: typeof import('kefir').default): Helpers
}

declare const createHelpers: HelpersFactory

export default createHelpers
