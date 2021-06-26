<template>
    <div>
        <div class="upload-header">
            <h1 style="color:red;display:inline-block;">创造中心</h1>
            <a style="margin-left:32px;"><i class="el-icon-platform-eleme"></i> 主页</a>
        </div>
        <div class="upload-body">
            <el-container style="height: 500px; border: 1px solid #eee">
                <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                    <div class="submitbox">
                        <a class="submit" @click="clickHandler"><i class="el-icon-s-promotion"></i>投稿</a>
                    </div>
                    <el-menu :default-openeds="['1', '3']">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-message"></i>内容管理</template>
                            <el-menu-item-group>
                                <template slot="title">稿件管理</template>
                                <el-menu-item index="1-1">草稿箱</el-menu-item>
                                <el-menu-item index="1-2">回收站</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="申诉管理">
                                <el-menu-item index="1-3">已申述进度</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="1-4">
                                <template slot="title">以往记录</template>
                                <el-menu-item index="1-4-1">不成功案例</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!-- 二级路由 -->  
                <router-view></router-view>   
            </el-container>
        </div>
    </div>
</template>

<script>

export default {
    methods:{
        clickHandler(){
            this.$router.push({
                name: "works",
                query: {
                ...this.$route.query//需要带userId的参数
                }
            })
        }
    }
}
</script>

<style lang="stylus">
.upload-header
    color white
    position relative
    top 0
    left 0
    height 60px
    z-index 11
    min-width 960px
    box-shadow 0 2px 10px 0 rgb(0 0 0 / 5%)
.el-header 
    background-color #B3C0D1
    color #333
    line-height 60px
    
.el-aside 
    color #333
.upload-body
    margin 0
    padding 0
.submitbox
    margin 20px 20px
    width 136px
.submit
    display block
    font-size 16px
    color #fff
    text-align center
    line-height 40px
    border-radius 4px
    background #00a1d6
    line-height 42px
.submit:hover
    background #00aed6
.el-icon-s-promotion
    margin-right 8px
    font-size 18px
</style>