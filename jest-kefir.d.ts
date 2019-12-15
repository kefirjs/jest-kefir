import {Observable, Stream, Property} from 'kefir'
import {Helpers as KHelpers, Event} from 'kefir-test-utils'
import {Clock} from 'lolex'
import {ExpectExtendMap} from 'jest'

export interface Helpers {
  prop: KHelpers['prop']
  stream: KHelpers['stream']
  pool: KHelpers['pool']
  activate: KHelpers['activate']
  deactivate: KHelpers['deactivate']
  send: KHelpers['send']
  value: KHelpers['value']
  error: KHelpers['error']
  end: KHelpers['end']
  extensions: ExpectExtendMap
}

export interface HelpersFactory {
  (Kefir: typeof import('kefir').default): Helpers
}

declare const createHelpers: HelpersFactory

export default createHelpers
