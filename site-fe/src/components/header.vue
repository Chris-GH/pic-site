<template>
    <div class="headerdiv">
        
        <a class="collection" href="/"><i class="el-icon-s-home"></i> </a>
        
        
        <div class="user-box" v-show="isLogin">
            <router-link :to="{name: 'space', query:{authorId: userInfo._id}}">
                <el-avatar style="vertical-align:middle;" shape="circle" size="medium" :src="userInfo.avatar"></el-avatar>
                <span>{{userInfo.name}}</span>
            </router-link>
            <router-link :to="{name:'upload'}">
                    <el-button
                    type="danger"
                    >投稿
                </el-button>
            </router-link>
            <a href="javascript:;" @click="loginOut">退出</a>
        </div>
        <div class="user-box" v-show="!isLogin">
            <router-link :to="{name:'login'}">
                <span>登录</span><span>注册</span>
            </router-link>
        </div>
        <div class="img-box">
            <div class="head-img"
                @mouseenter="mouseenterHandle"
                @mousemove="mousemoveHandle"
                @mouseleave="mouseleaveHandle"
                ref="headimg">
                <img src="../img/angel.jpg" style="height:100px;margin-right:10px;">
                <img src="../img/chao1.jpg" style="height:100px">
                <img src="../img/chao3.jpg" style="height:100px">
                <img src="../img/chao4.jpg" style="height:100px">
                <img src="../img/chao5.jpg" style="height:100px">
                <img src="../img/tnks.jpg" style="height:100px">
                <img src="../img/yuan.jpg" style="height:100px">
                <img src="../img/bjt.jpg" style="height:100px">
                <img src="../img/rjr182.jpg" style="height:100px">
                <img src="../img/rjr181.jpg" style="height:100px">
                <img src="../img/rjr183.jpg" style="height:100px">
                <img src="../img/demon.jpg" style="height:100px;margin-left:10px;">
            </div>
        </div>
    </div>
</template>
<script>
import {login_out} from '@/service/api'

export default {
    name:"sHeader",
    computed:{
      isLogin(){return this.$store.getters.isLogin;},
      userInfo(){
        return this.$store.state.userInfo;
      }
    },
    data(){
        return {
            percent:0,
            initialleft:0,
            clientX:0,
        }
    },
    mounted(){
        let left = (window.innerWidth-1500)/2;
        this.initialleft = left;
        this.percent = left/window.innerWidth;

        this.$refs.headimg.style.transitionDuration = "0s";
        this.$refs.headimg.style.transform = "translateX(" + left +"px)";
    },
    methods:{
        mouseenterHandle(e){
            //console.log("进入视图");
            const {clientX} = e;
            this.clientX = clientX;
        },
        mousemoveHandle(e){
            const {clientX} = e;
            //let left = (clientX - this.clientX)*this.percent + this.initialleft;//鼠标左移left值变大
            //this.$refs.headimg.style.left=left + "px";
            let left = (clientX - this.clientX)*this.percent;
            let moveleft = this.initialleft+left;
            this.$refs.headimg.style.transitionDuration = "0s";
            this.$refs.headimg.style.transform = "translate(" + moveleft + "px)";
        },
        mouseleaveHandle(){
            //console.log("离开视图");
            //this.$refs.headimg.style.left=this.initialleft + "px";
            this.$refs.headimg.style.transitionDuration = "0.5s";
            this.$refs.headimg.style.transform = "translateX(" + this.initialleft +"px)";
        },
        loginOut(){
            this.$confirm('真的确定要登出吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await login_out();
            //const data = await login_out();
            //console.log("登出",data);
                localStorage.removeItem('token');
                window.location.href = '/';
            }).catch(() => {});
        }
    }
}
</script>

<style lang="stylus">
    .headerdiv
        position relative
    .img-box
        margin 0 auto
        width 1200px
        overflow hidden
    .head-img
        height 100px
        width 1520px
    .collection
        z-index 2
        position absolute
        top 10px
        left 50px
        background white
        border-radius 36px
        width 36px
        height 36px
        text-align center
        line-height 36px
        margin 0 auto 5px
        font-size 28px
    .whitetext
        color white
    .user-box
        z-index 2
        position absolute
        top 5px
        right 200px
        pointer-events auto
</style>