import cookie from 'js-cookie'
import cookieKeys from '@/const/cookie-keys'

// 最好提前在你的 store 中初始化好所有所需属性
// https://vuex.vuejs.org/zh-cn/mutations.html
export const state = () => ({
  // 这两个用于client side的使用, 又放cookie里是为了刷新时状态不丢失
  userId: '',
  token: '',
  tenantId: '',
  meta: {},

  user: {},
  menuList: [],
  permission: {}
})

//  mutation 必须同步执行
export const mutations = {
  login(state, payload) {
    state.token = payload.key
    state.userId = payload.id
    state.tenantId = payload.tenantId

    // 部署不一定是在根路径, 所以cookie要设置path
    let path = process.env.COOKIE_PATH
    cookieKeys.forEach(key => {
      cookie.set(key, payload[key], {path})
    })
  },
  logout(state) {
    state.token = ''
    state.userId = ''
    state.tenantId = ''

    let path = process.env.COOKIE_PATH
    cookieKeys.forEach(key => {
      cookie.remove(key, {path})
    })
  },
  update(state, payload) {
    Object.keys(payload).forEach(k => {
      state[k] = payload[k]
    })
  }
}

// Action 提交的是 mutation，而不是直接变更状态
// Action 可以包含任意异步操作
export const actions = {
  async login(context, payload) {
    // store 对象
    // console.log(context)
    let {commit, state, dispatch} = context

    let resp = await this.$axios.$post(`/security/api/v1/users/login`, payload)
    commit('login', resp.payload)

    dispatch('fetchUserAndMenuList', {userId: resp.payload.id})
  },
  async fetchUserAndMenuList({commit}, {userId}) {
    let user = await this.$axios.$get(`/security/api/v1/users/${userId}`)

    commit('update', {user: user.payload})

    let menuResources = await this.$axios.$get(
      `/security/api/v1/users/${userId}/menuResources`
    )
    if (!menuResources.payload)
      menuResources.payload = {
        menu: [],
        permission: {}
      }

    commit('update', {
      menuList: menuResources.payload.menu,
      permission: menuResources.payload.permission
    })
  },
  // 配置的元信息
  async fetchMetaInfo({commit}, {projectNo}) {
    let resp = await this.$axios.$get('/security/api/v1/configs')
    let meta = {}
    resp.payload.forEach(item => {
      meta[item.key] = item.value
    })
    commit('update', {meta})
  }
}
