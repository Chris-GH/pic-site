<template>
    <div class="card-list">
        <div class="card-title">
            <div class="title-left">
                <i class="el-icon-picture"></i>
                <a>图片</a>
            </div>
            <div class="title-right">
                <div @click="refresh"><i class="el-icon-refresh"></i>换一换</div>
                <div><i class="el-icon-arrow-right"></i>更多</div>
            </div>
        </div>
        <div class="card-content">
            <scard v-for="item,index in lists" :key="index" :info=item></scard>
        </div>
    </div>
</template>

<script>
import scard from "../components/card"

export default {
    components:{scard},
    props:{
        lists: {
            type: Array,
            default: () => []
        },
    },
    methods:{
        refresh(){
            this.$emit('refresh');
        }
    }
}
</script>

<style lang="stylus">
.card-list
    width 710px
.title-left
    >a
        margin 0 0 0 10px
        vertical-align bottom
        font-size 20px
        line-height 36px
.el-icon-picture
    font-size 30px
    color #00a1d6
.card-title
    display flex
    justify-content space-between
    margin-bottom 10px
.title-right
    display flex
    >div
        cursor pointer
        text-align center
        border 1px solid silver
        border-radius 2px
        height 20px
        font-size 14px
        color #505050
        margin-left 10px
.card-content
    width 710px!important
    height 500px
    display flex
    flex-wrap wrap
    justify-content space-between
</style>