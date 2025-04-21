const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    // Define Vue feature flags
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
      })
    ]
  },
  // Fix meta tag warnings by adding proper mobile web app capable meta tag
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].meta = {
        ...(args[0].meta || {}),
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-capable': 'yes'
      }
      return args
    })
  },
  // Force development server to use localhost for WebSocket connections
  devServer: {
    host: 'localhost',
    port: 8080,
    client: {
      webSocketURL: 'ws://localhost:8080/ws'
    }
  }
})
