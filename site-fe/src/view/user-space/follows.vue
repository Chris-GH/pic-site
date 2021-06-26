<template>
    <div>
        <div class="follow-box" v-for="item,index in lists" :key="index">
            <img :src="item.avatar">
            <div class="follow-box-text">
                <p style="color:#777;margin:0;">{{item.name}}</p>
                <p style="flex:12;">{{item.sign}}</p>
                <div class="split"></div>
            </div>
            <span class="follow-follow" :class="{active:!isFollow}" @click="handleFollow(item._id)">{{ isFollow ? '已关注' : '关注' }}</span>
        </div>
    </div>
</template>

<script>
import {toggleFollow} from "@/service/api"
export default {
    props:{
        lists: {
            type: Array,
            default: () => []
        },
    },
    data(){
        return {
            isFollow:true,
        }
    },
    methods:{
        async handleFollow(authorId){
            if(this.$store.state.userInfo._id==undefined) {
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
                        let data = await toggleFollow({authorId:authorId});
                        if(data.code===0){
                            this.isFollow=!this.isFollow;
                            //console.log("success",data.mes);
                        }
                    }).catch(() => {

                    });
                }
            else      
            {let data = await toggleFollow({authorId:authorId});
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
.follow-box
  display flex
.follow-box img
  margin-right 10px
  height 30px
  width 30px
  vertical-align top
.follow-box-text
  flex 1
  font-size 12px
  vertical-align top
.split
  width 100%
  border-bottom 1px solid #ddd
  margin 10px 0 10px 0
.follow-follow
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