<template>
    <div style="width:256px;">
        <header class="rank-header">
            <span class="rank-name">排行榜</span>
            <div>更多<i class="el-icon-arrow-right"></i></div>
        </header>
        <div class="rank-tag" v-for="item,index in info" :key="index">
            <span class="number">{{index+1}}</span>
            <a>
                <p class="txt-row"><span class="txt-title">{{item.title}}</span><span class="txt-update">更新至193话</span></p>
            </a>
        </div>
    </div>
</template>

<script>

export default {
    props:{
        info: {
            type: Array,
            default: () => []
        },
    }
}
</script>
<style lang="stylus">
.rank-header
    display flex
    justify-content space-between
.rank-name
    color #212121
    vertical-align bottom
    font-size 20px
    line-height 28px
.rank-header
    height auto
    margin-bottom 10px
    >div
        cursor pointer
        text-align center
        border 1px solid silver
        border-radius 2px
        height 20px
        font-size 14px
        color #505050
        margin-left 10px
.number
    color #fff
    background #00a1d6
    font-size 14px
    width 18px
    height 18px
    text-align center
    line-height 18px
    border-radius 2px
.rank-tag
    display flex
    justify-content space-between
    margin-bottom 18px
    .txt-row
        width 225px
        display flex
        line-height 20px
        justify-content space-between
.txt-title
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
    width 198px
    font-size 14px
    font-weight 500
.txt-update
    font-size 12px
    color #999
    text-align right
    min-width 90px
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
</style>
