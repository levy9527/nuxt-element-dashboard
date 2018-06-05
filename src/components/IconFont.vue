<template>
  <i :class="'iconfont ' + icon"></i>
</template>

<script>
export default {
  name: 'IconFont',
  props: {
    icon: {
      type: String
    }
  }
}
</script>
<style>
</style>
