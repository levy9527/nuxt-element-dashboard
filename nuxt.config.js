let apiServer = 'http://prod.domain'
let mockServer = 'http://dsn.apizza.cc/mock/710f9fb77f08d7a01fce444be84dff6e'

let axios = {
  proxy: true
}

// 生产部署放到kong后面不代理
if (process.env.mode == 'prod') {
  axios = {
    proxy: false,
    baseURL: apiServer
  }
}

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Pyramid Dashboard',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {
        hid: 'description',
        name: 'description',
        content: '组件市场管理平台, 适用于组件市场运营团队'
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
    base: process.env.mode == 'prod' ? '/pyramid-dashboard/' : '/'
  },
  plugins: [{src: '~/plugins/axios'}, {src: '~/plugins/element'}],
  modules: ['@nuxtjs/axios'],
  axios,
  proxy: {
    '/security': apiServer,
    '/pyramid': process.env.mode == 'dev' ? mockServer : apiServer
  }
}
