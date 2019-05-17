/*
 * @Author: Han
 * @Date: 2019-05-08 15:13:59
 * @Last Modified by: Han
 * @Last Modified time: 2019-05-15 15:51:46
 * @Description 请求拦截，适配 restEasy 后端API服务框架，若数据格式不符合下面的数据格式，则会按照 httpStatusCode 正常触发对应的事件。
 * @Example
 * 适配api返回格式：
 * {
 *   code: Number, // 业务状态码 0: 操作成功;
 *   msg: String,  // 业务操作信息 当 code === 0 时为 "ok"; code !== 0 时为具体的失败信息
 *   payload: Any, // 接口返回数据
 * }
 *
 * 当 code !== 0 同时 httpStatusCode === 200 时，请求会被拦截到 xhr.onerror 事件，即此时的请求操作会被 Promise.catch 捕获。
 * 其余情况都和普通请求行为一致
 */

import Vue from 'vue'

export default function({$axios, store, app, redirect}) {
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

  $axios.onResponse(resp => {
    const {data} = resp
    const code = parseInt(data.code)

    // 如果code存在且不等于0，则将响应到error中
    if (code !== 0 && !Number.isNaN(code)) {
      // 如果httpStatusCode = 200, 但是操作失败的请求，将响应转为error
      // 兼容error的数据结构
      return Promise.reject({response: resp})
    } else {
      // 不能直接resolve resp.data 因为部分组件是按照axios原本的返回数据结构进行设计的
      return Promise.resolve(resp)
    }
  })

  $axios.onError(error => {
    if (process.client) {
      // axios 数据结构
      let resp = error.response
      let data = resp.data

      Vue.$notify.error({
        title: data.code || resp.status,
        message: data.msg || data.payload
      })

      if (resp.status == 401) {
        // 没有权限，执行一次logout，然后重新登录
        store.commit('logout')
      }
    } else {
      // TODO asyncData 的错误 需要日志监控
      console.log('error', error)
    }

    // 将错误信息继续抛出，业务逻辑可以进行后续的操作
    return Promise.reject(error)
  })
}
