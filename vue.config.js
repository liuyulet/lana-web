const path = require('path')

const minify = process.env.NODE_ENV === 'development' ? false : {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true,

}

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/form-generator/'
    : '/',
  pages: {
    index: {
      entry: 'src/views/index/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      minify
    },
    preview: {
      entry: 'src/views/preview/main.js',
      template: 'public/preview.html',
      filename: 'preview.html',
      chunks: ['chunk-vendors', 'chunk-common', 'preview'],
      minify
    }
  },
/*  devServer: {
    overlay: false
  },*/
/*  devServer: {
    open: false,
    port: 8080,
    host: '0.0.0.0',
    https: false,
    hotOnly: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    /!* 使用代理 *!/
    proxy: {
      "/sys": {
        target: process.env.VUE_APP_API_BASE_URL,
        ws: true,
        secure: true, // 使用的是http协议则设置为false，https协议则设置为true
        changOrigin: true,
        pathRewrite: {
          "^/sys": "",
        },
      }
    }
  },*/

  devServer: {
    open: false,
    port: 8080,
    host: '0.0.0.0',
    https: false,
    hotOnly: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  productionSourceMap: false,
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT'
    }
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
