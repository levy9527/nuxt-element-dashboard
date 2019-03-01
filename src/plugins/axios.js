import Vue from 'vue'
import cookie from 'js-cookie'
import cookieKeys from '@/const/cookie-keys'

export default function(context) {
  let {$axios, store, app, redirect} = context

  $axios.onRequest(config => {
    let url = config.url
    // jwt 验证
    if (store.state.token) {
      config.headers.common['Authorization'] = `Bearer ${store.state.token}`
    }

    url += url.indexOf('?') > -1 ? '&' : '?'
    url += `tenantId=${store.state.tenantId}&userId=${
      store.state.userId
    }&_=${new Date().getTime()}`

    config.url = url

    return config
  })

  $axios.onError(error => {
    if (process.client) {
      // axios 数据结构
      let resp = error.response
      let data = resp.data

      Vue.$notify.error({
        title: resp.status,
        message: data.payload || data.msg
      })

      if (resp.status == 401) {
        let path = process.env.COOKIE_PATH
        cookieKeys.forEach(key => {
          cookie.remove(key, {path})
        })
        redirect('/login')
      }
    }
    // TODO asyncData 的错误 需要日志监控
    else console.log('error', error)
  })
}
