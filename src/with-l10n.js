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
import { createActionFactory } from 'basic-fsa-factories'
import { into } from 'basic-cursors'
import compose from 'basic-compose'
import { exclude, forType, mapPayload, pluck as select } from 'utils'
import { fromEvent } from 'rxjs'
import {
  distinctUntilChanged,
  filter,
  map,
  pluck,
  switchMap
  // tap
} from 'rxjs/operators'
// const log = label => console.log.bind(console, label)

const reducer = compose.into(0)(
  forType('CHANGE_LOCALE')(into('locale')(mapPayload())),
  forType('PROPS')(
    compose.into(0)(
      into('props')(mapPayload(exclude('channel'))),
      into('channel')(mapPayload(select('channel')))
    )
  )
)

const changeLocale = createActionFactory('CHANGE_LOCALE')

function changeLocaleOnChannelUpdate (event$, state$) {
  return state$.pipe(
    pluck('channel'),
    distinctUntilChanged(),
    filter(Boolean),
    switchMap(channel => fromEvent(channel, '@zenyway/l10n/update')),
    pluck('locale'),
    filter(Boolean),
    map(locale => changeLocale(locale))
  )
}

const mapStateToProps = ({ props, locale }) => ({
  ...props,
  locale: locale || props.locale
})

export function withL10n (StorySFC) {
  return componentFromEvents(
    StorySFC,
    // () => tap(log('@zenyway/with-l10n:event:')),
    redux(reducer, changeLocaleOnChannelUpdate),
    // () => tap(log('@zenyway/with-l10n:state:')),
    connect(mapStateToProps)
    // () => tap(log('@zenyway/with-l10n:view-props:'))
  )
}
