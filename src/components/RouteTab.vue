<template>
  <div class="route-tab">
    <el-tabs v-model="active" v-bind="tab" @tab-click="onClick">
      <el-tab-pane v-for="(route) in routes" :key="route.path" :label="route.name" :name="route.path"
                   :disabled="route.disabled" :closable="route.closable">
        <slot v-if="route.path === $route.path"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'routeTab',
  props: {
    // el-tabs attribute
    tab: {
      type: Object
    },
    routes: {
      type: Array,
      default() {
        return [
          // tab 名字跟对应路由
          // 后面两个对应 el-tab-pane attribute
          {name: '', path: '', disabled: false, closable: false}
        ]
      }
    }
  },
  data() {
    return {
      active: this.$route.path
    }
  },
  methods: {
    onClick() {
      this.$router.push({
        path: this.active,
        query: this.$route.query
      })
    }
  }
}
</script>
<style lang="stylus">
  .route-tab {
    .el-tabs__header.is-top {
      margin-bottom 40px
    }
  }
</style>
