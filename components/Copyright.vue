<template>
  <div class="copyright">
    Copyright © 2013 - {{new Date().getFullYear()}} 云徙科技有限公司 版权所有 | 粤ICP备13057902号-6
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
