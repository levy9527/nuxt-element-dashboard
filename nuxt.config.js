let API_SERVER = 'http://119.29.28.59'
const SECURITY_API_SERVER = 'http://119.29.28.59'
const PROJECT_NO = ''
const ALI_ICON_FONT = '//at.alicdn.com/t/font_574145_ufxg504x3zorms4i.css' // 阿里iconfont

let mockServer = 'http://yapi.demo.qunar.com/mock/9638'
let apiServer = process.env.API_SERVER || API_SERVER
let securityApiServer = process.env.SECURITY_API_SERVER || SECURITY_API_SERVER
let axios = {}

let context =
  process.env.CONTEXT && process.env.CONTEXT.length > 1
    ? `/${process.env.CONTEXT}/`
    : '/'

// 部署放到kong后面不代理
if (process.env.IS_PROXY) {
  axios = {
    proxy: true
  }
} else {
  axios = {
    proxy: false,
    baseURL: apiServer
  }
}

module.exports = {
  env: {
    PROJECT_NO: process.env.PROJECT_NO || PROJECT_NO
  },
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
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: context + 'favicon.ico'
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: ALI_ICON_FONT
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#1890ff'
  },
  css: [
    {
      src: '~assets/global.styl',
      lang: 'stylus'
    }
  ],
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
    // 部署到kong 才需要 context
    base: context
  },
  plugins: [
    {
      src: '~/plugins/axios'
    },
    {
      src: '~/plugins/element'
    }
  ],
  modules: ['@nuxtjs/axios'],
  axios,
  proxy: {
    '/security': securityApiServer,
    '/pmsX-api': process.env.mode == 'dev' ? mockServer : apiServer
  }
}
