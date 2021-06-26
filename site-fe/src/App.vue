<template>
  <div id="app">
      <header><sHeader></sHeader></header>
      <section class="main">
        <!--路径对应的组件会替换在这个位置-->
        <router-view></router-view>
      </section>
      <footer><sFooter></sFooter></footer>
  </div>
</template>

<script>

import sHeader from "@/components/header"
import sFooter from "@/components/footer"
export default {
  name: 'App',
  components:{sHeader,sFooter}
}
</script>

<style lang="stylus">
body 
  background: #eeeeee
  font-size 12px
header
  margin 0
  padding 0
  height 100px
.main
  padding 20px 0px
  width 990px
  margin 0 auto
  position relative
footer
  text-align center
  height 42px
  line-height 42px
</style>
