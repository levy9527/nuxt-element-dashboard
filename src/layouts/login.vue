<template>
  <div class="layout-login">
    <h1 class="title">Optimus Dashboard</h1>
    <nuxt></nuxt>
    <copyright></copyright>
  </div>
</template>

<script>
import Copyright from '../components/Copyright.vue'
export default {
  name: 'login',
  components: {
    Copyright
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="stylus">
  // 参考ant-design pro样式
  .layout-login {
    width: 100%;
    min-height: 100%;
    background-color: #f0f2f5;
    background-image: url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    padding: 90px 0 0;
    position: fixed;

    .title {
      margin: 0 auto 40px;
      text-align: center;
      font-size: 30px;
      color: rgba(0, 0, 0, 0.85);
      font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
      font-weight: 500;
      position: relative;
      top: 2px;
    }
    .main {
      width: 368px;
      margin: 0 auto 100px;
    }

    button {
      width: 368px;
    }
  }
</style>
