let apiServer = 'http://114.67.159.3:8081'
let securityServer = 'http://119.29.28.59'
let mockServer = 'http://yapi.demo.qunar.com/mock/9638'

let axios = {
  proxy: true
}

// 生产部署放到kong后面不代理
if (process.env.mode == 'prod') {
  // axios = {
  //   proxy: false,
  //   baseURL: apiServer
  // }
}

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Stonehenge',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {
        hid: 'description',
        name: 'description',
        content: '开发平台'
      }
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '//at.alicdn.com/t/font_574145_ufxg504x3zorms4i.css'
      }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: {color: '#1890ff'},
  css: [{src: '~assets/global.styl', lang: 'stylus'}],
  /**
   * 把代码目录跟其他目录分离
   */
  srcDir: 'src/',
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk'
          }
        ]
      ]
    },
    /*
    ** Run ESLint on save
    */
    extend(config, {isDev}) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  router: {
    middleware: ['auth'],
    base: process.env.mode == 'prod' ? '/stonehenge/' : '/'
  },
  plugins: [{src: '~/plugins/axios'}, {src: '~/plugins/element'}],
  modules: ['@nuxtjs/axios'],
  axios,
  proxy: {
    '/security': process.env.mode == 'dev' ? mockServer : securityServer,
    '/generator': process.env.mode == 'dev' ? mockServer : apiServer
  }
}
