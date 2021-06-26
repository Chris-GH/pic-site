<template>
    <div>
        <div class="fans-box" v-for="item,index in lists" :key="index">
            <img :src="item.avatar">
            <div class="fans-box-text">
                <p style="color:#777;margin:0;">{{item.name}}</p>
                <p style="flex:12;">{{item.sign}}</p>
                <div class="split"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        lists: {
            type: Array,
            default: () => []
        },
    },
    methods:{
        handleEdit(){}
    }
}
</script>

<style lang="stylus">
.fans-box
  display flex
.fans-box img
  margin-right 10px
  height 30px
  width 30px
  vertical-align top
.fans-box-text
  flex 1
  font-size 12px
  vertical-align top
.split
  width 100%
  border-bottom 1px solid #ddd
  margin 10px 0 10px 0
.fans-follow
    font-size 14px
    color red 
    border 1px solid red
    border-radius 10px
    padding 0 10px
    cursor pointer
    height fit-content
.active
    background-color red
    color white
</style>