/**
 * Created by levy on 2018/2/24.
 * @deprecated 改为静态化部署后, 不再使用它
 */

export default async function(context) {
  let {store, route, redirect, req} = context
  // console.log('auth', context)

  // https://stackoverflow.com/questions/10730362/get-cookie-by-name
  const getCookie = function(cookie, name) {
    var value = '; ' + cookie
    var parts = value.split('; ' + name + '=')
    if (parts.length == 2)
      return parts
        .pop()
        .split(';')
        .shift()
  }

  // 应对刷新 状态丢失
  if (process.server && route.name && route.path !== '/login') {
    let userId = getCookie(req.headers.cookie, 'userId')

    // 未登录
    if (!userId) return redirect('/login')

    // 已登录
    store.commit('update', {
      token: getCookie(req.headers.cookie, 'token'),
      userId
    })
    let p
    try {
      p = await store.dispatch('fetchUserAndMenuList', {userId})
      return p
    } catch (e) {
      // TODO
      // 1. clear cookie
      // 2. show message
      console.log('auth error: ', e)
      redirect('/login')
    }
  }
}
