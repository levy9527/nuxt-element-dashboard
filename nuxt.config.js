require('dotenv').config()

const env = process.env
const isProd = env.MODE == 'prod'

let apiServer = process.env.API_SERVER || 'http://portal.deepexi.top'
let publicPath = process.env.PUBLIC_PATH || 'http://cdn.deepexi.com/'

const config = {
  projectNo: env.PROJECT_NO || '',
  aliIconFont: '',
  env: {
    mock: {
      '/api': 'http://yapi.demo.qunar.com/mock/9638',
      '/security': 'http://111.231.236.219'
    },
    dev: {
      '/api': 'http://119.29.28.59',
      '/security': 'http://111.231.236.219'
    }
  }
}

let axios = {
  proxy: true
}

// 生产部署放到网关后面不代理
if (isProd) {
  axios = {
    proxy: false,
    baseURL: apiServer
  }
}

module.exports = {
  mode: 'spa',
  env: {
    PROJECT_NO: config.projectNo,
    NO_LOGIN: process.env.NO_LOGIN
  },
  proxy: config.env[env.MODE],
  router: {
    middleware: ['meta'],
    mode: 'hash'
  },
  /*
   ** Build configuration
   */
  build: {
    publicPath,
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
  /*
  ** Headers of the page
  */
  head: {
    title: 'Optimus',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {'http-equiv': 'x-ua-compatible', content: 'IE=edge, chrome=1'},
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
        href: 'favicon.ico'
      },
      {
        // rel: 'stylesheet',
        // type: 'text/css',
        // href: config.aliIconFont
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
  srcDir: 'src/',
  plugins: [
    {
      src: '~/plugins/axios'
    },
    {
      src: '~/plugins/element'
    }
  ],
  modules: ['@nuxtjs/axios'],
  axios
}
