/**
 * Copyright 2018 ZenyWay S.A.S., Stephane M. Catala
 * @author Stephane M. Catala
 * @license Apache Version 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * Limitations under the License.
 */

import componentFromEvents, { connect, redux } from 'component-from-events'
import {
  createActionDispatchers,
  createActionFactory
} from 'basic-fsa-factories'
import { into } from 'basic-cursors'
import compose from 'basic-compose'
import { exclude, forType, mapPayload, pluck as select } from 'utils'
import { NEVER, fromEvent, merge } from 'rxjs'
import {
  catchError,
  distinctUntilChanged,
  filter,
  ignoreElements,
  map,
  pluck,
  share,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators'
// const log = label => console.log.bind(console, label)

const reducer = compose.into(0)(
  forType('CHANGE_LOCALE')(into('locale')(mapPayload())),
  forType('CHANGE_LOCALES')(into('locales')(mapPayload())),
  forType('PROPS')(
    compose.into(0)(
      into('props')(mapPayload(exclude('channel'))),
      into('channel')(mapPayload(select('channel')))
    )
  )
)

const changeLocales = createActionFactory('CHANGE_LOCALES')
const changeLocale = createActionFactory('CHANGE_LOCALE')

function changeLocalesOnChannelUpdate (event$, state$) {
  const update$ = state$.pipe(
    pluck('channel'),
    distinctUntilChanged(),
    filter(Boolean),
    switchMap(channel => fromEvent(channel, '@zenyway/l10n/update')),
    catchError(function (err) {
      log('@zenyway/l10n-panel:ERROR:')(err)
      return NEVER
    }),
    share()
  )
  const changeLocales$ = update$.pipe(
    pluck('locales'),
    filter(Boolean),
    map(locales => changeLocales(locales))
  )
  const changeLocale$ = update$.pipe(
    pluck('locale'),
    filter(Boolean),
    map(locale => changeLocale(locale))
  )
  return merge(changeLocales$, changeLocale$)
}

function channelUpdateOnChange (event$, state$) {
  return event$.pipe(
    filter(({ type }) => type === 'CHANGE'),
    pluck('payload'),
    withLatestFrom(state$),
    tap(([locale, { channel }]) =>
      channel.emit('@zenyway/l10n/update', { locale })
    ),
    ignoreElements()
  )
}

const mapStateToProps = ({ props, locale, locales }) => ({
  ...props,
  locales,
  locale
})

const mapDispatchToProps = createActionDispatchers({
  onChange: ['CHANGE', ({ currentTarget: { value } }) => value]
})

export function l10nPanel (L10nPanelSFC) {
  return componentFromEvents(
    L10nPanelSFC,
    // () => tap(log('@zenyway/l10n-panel:event:')),
    redux(reducer, channelUpdateOnChange, changeLocalesOnChannelUpdate),
    // () => tap(log('@zenyway/l10n-panel:state:')),
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
    // () => tap(log('@zenyway/l10n-panel:view-props:'))
  )
}
