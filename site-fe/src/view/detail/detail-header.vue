<template>
    <section class="detail-header">
        <i class="el-icon-arrow-left" style="font-size:4em;margin:auto 0 auto 0;"></i>
        <router-link  class="img" :to="{name:'space',query:{authorId: info.authorId}}">
                    <img :src="info.avatar">
                    {{info.name}}
        </router-link>
        <span v-if="!isOwner" class="follow" :class="{active:!isFollow}" @click="handleFollow">{{ isFollow ? '已关注' : '关注' }}</span>
    </section>
</template>

<script>
import {toggleFollow} from "@/service/api"
export default {
    watch:{
        $route:{
            async handler(){
                this.isOwner = this.info.authorId===this.userInfo._id;
            },
                immediate: true
            }
    },
    props:{
        info: {
            type: Object,
            default: () => ({})
        }
    },
    data(){
        return {
            isFollow:this.info.isFollow,
            userInfo:this.$store.state.userInfo,
            isOwner: false,
        }
    },
    methods:{
        async handleFollow(){
            if(this.userInfo._id==undefined) {
                this.$message({
                    message:"请先登录！",
                    type:"warning"
                });
                await this.delay(1500);
                window.location="/login";return ;
            }
            if(this.isFollow){
                    this.$confirm('确认不再关注?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    type: 'warning'
                    }).then(async () => {
                        let data = await toggleFollow({authorId:this.info.authorId});
                        if(data.code===0){
                            this.isFollow=!this.isFollow;
                            //console.log("success",data.mes);
                        }
                    }).catch(() => {

                    });
                }
            else      
            {let data = await toggleFollow({authorId:this.info.authorId});
            if(data.code===0){
                 this.isFollow=!this.isFollow;
                //console.log("success",data.mes);
            }}
        },
        delay(t){return new Promise(r=>setTimeout(r,t));},
    }
}
</script>

<style lang="stylus">
.img
    font-size 18px
.img img
    margin-right 10px
    height 70px
    width 70px
    border-radius 35px
.follow
    font-size 14px
    color red 
    border 1px solid red
    border-radius 10px
    padding 0 10px
    float right
    cursor pointer
.active
    background-color red
    color white
</style>