/**
 * @license
 * Copyright 2018 Stephane M. Catala
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
//
import redux, { connect as _connect } from 'component-from-stream-redux'
import componentFromStream from 'component-from-props'
import { noop } from 'rxjs'
import { map } from 'rxjs/operators'
import { createActionFactory } from 'basic-fsa-factories'
import compose from 'basic-compose'

export { redux }

export function connect (mapStateToProps, mapDispatchToProps = noop) {
  return compose.into(0)(map, _connect(mapStateToProps, mapDispatchToProps))
}

export default function (render, factory, ...factories) {
  return componentFromStream(
    render,
    createActionFactory('PROPS'),
    factory,
    ...factories
  )
}
