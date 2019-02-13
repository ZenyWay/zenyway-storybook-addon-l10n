// https://storybook.js.org/configurations/custom-webpack-config/#full-control-mode--default
const path = require('path')

module.exports = (baseConfig, env, config) => {
  config.devtool = 'inline-source-map' // development only

  // add alias specs from package browser field
  config.resolve.aliasFields = (config.resolve.aliasFields || []).concat(
    'browser'
  )

  // replace react with inferno
  /*
  config.resolve.alias = Object.assign({}, config.resolve.alias, {
    react: 'inferno-compat',
    'react-devtools': 'inferno-devtools',
    'react-dom': 'inferno-compat'
  })
  */

  return config
}
