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
/** @jsx createElement */
import { createElement } from 'create-element'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import addons from '@storybook/addons'
import { L10nPanel } from '../src/l10n-panel'

const channel = addons.getChannel()
const locales = ['fr', 'en']

storiesOf('L10nPanel', module).add('active', () => {
  const locale = locales[0]
  Promise.resolve().then(() => {
    channel.emit('@zenyway/l10n/update', { locales, locale })
  })
  return <L10nPanel channel={channel} active />
})
