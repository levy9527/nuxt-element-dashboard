<template>
  <div class="copyright">
    Copyright © 2018 - {{new Date().getFullYear()}} 滴普科技 版权所有
  </div>
</template>

<script>
export default {
  name: 'copyright'
}
</script>
<style scoped>
.copyright {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  text-align: center;
  line-height: 60px;
}
</style>
