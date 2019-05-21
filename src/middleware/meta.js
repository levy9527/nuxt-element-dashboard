/**
 * Created by levy on 2018/7/10.
 */
import META from '@/const/meta.js'

export default function({store, app}) {
  // if (process.server) return

  if (!store.state.meta.appName) {
    store.commit('update', {meta: META})

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
