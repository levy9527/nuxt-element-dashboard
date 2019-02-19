import Vue from 'vue'
import cookie from 'js-cookie'

export default function(context) {
  let {$axios, store, app, redirect} = context

  $axios.onRequest(config => {
    let url = config.url

    url += url.indexOf('?') > -1 ? '&' : '?'
    url += `token=${store.state.token}`

    // 调用用户中心的接口需要加上projectNo
    if (url.indexOf('/security/') > -1) {
      url += `&projectNo=${process.env.PROJECT_NO}`
    }

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
        cookie.remove('token', {path})
        cookie.remove('userId', {path})
        redirect('/login')
      }
    }
    // TODO asyncData 的错误 需要日志监控
    else console.log('error', error)
  })
}
