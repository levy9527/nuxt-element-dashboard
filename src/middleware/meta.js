/**
 * Created by levy on 2018/7/10.
 */
export default async function({store, app}) {
  // if (process.server) return

  if (!store.state.meta.appName) {
    try {
      await store.dispatch('fetchMetaInfo', {projectNo: process.env.PROJECT_NO})
    } catch (e) {
      console.log('meta error: ', e)
    }

    let meta = store.state.meta
    let head = app.head

    let headLinks = head.link
    let link = {}

    // 为了支持IE。。。
    for (let i = 0; i < headLinks.length; i++) {
      if (headLinks[i].rel == 'icon') {
        link = headLinks[i]
        break
      }
    }

    head.title = meta.htmlTitle
    link.href = meta.favicon
  }
}
