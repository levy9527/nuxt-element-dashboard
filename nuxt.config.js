const config = {
  projectNo: '070582f03ce2493e9e7311dccfc89f0c',
  aliIconFont: '//at.alicdn.com/t/font_574145_ufxg504x3zorms4i.css',
  env: {
    mock: {
      '/api': 'http://yapi.demo.qunar.com/mock/9638',
      '/security': 'http://119.29.28.59'
    },
    dev: {
      '/api': 'http://119.29.28.59',
      '/security': 'http://119.29.28.59'
    },
    prod: {
      // 生产环境，docker传参
      '/api': process.env.API_SERVER,
      '/security': process.env.SECURITY_API_SERVER
    }
  }
}

const mode = process.env.MODE
let axios = {}

let context =
  process.env.CONTEXT && process.env.CONTEXT.length > 1
    ? `/${process.env.CONTEXT}/`
    : '/'

if (process.env.IS_PROXY) {
  axios = {
    proxy: true
  }
} else {
  axios = {
    proxy: false,
    baseURL: process.env.API_SERVER
  }
}

module.exports = {
  env: {
    PROJECT_NO: process.env.PROJECT_NO || config.projectNo
  },
  proxy: {...config.env[mode]},
  router: {
    middleware: ['auth'],
    base: context
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Optimus',
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
        href: config.aliIconFont
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
