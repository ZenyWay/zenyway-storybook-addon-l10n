# zenyway-storybook-addon-l10n
[![NPM](https://nodei.co/npm/zenyway-storybook-addon-l10n.png?compact=true)](https://nodei.co/npm/zenyway-storybook-addon-l10n/)

add a Locales panel to storybook from which to select and inject a locale prop into decorated stories.

# Usage
1. register this addon in `.storybook/addons.js`
```js
import 'zenyway-storybook-addon-l10n/register'
```

2. decorate stories
```js
import { storiesOf } from '@storybook/react'
import withL10n from 'zenyway-storybook-addon-l10n'

storiesOf('Example', module)
.addDecorator(withL10n({
  locales: ['de', 'en', 'fr']
}))
.add('example-story', ({ locale }) => <p>selected: {locale}</p>)
```

# License
Copyright 2019 ZenyWay S.A.S., Stéphane M. Catala

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the [License](./LICENSE) for the specific language governing permissions and
Limitations under the License.
