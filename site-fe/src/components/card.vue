<template>
    <div>
        <div style="width:150px;">
            <router-link :to="{name: 'detail', query:{artId: info._id}}">
                <div><img v-if="info.pic_url" style="width:150px;height:200px;" :src="info.pic_url[0]"/></div>
            </router-link>
            <div>{{info.title}}</div>
            <div style="display:flex;justify-content:space-between;">
                <router-link :to="{name: 'space', query:{authorId: info.authorId}}">
                    <div >
                        <img style="border-radius:10px;width:20px;height:20px;vertical-align:middle;" :src="info.avatar"/><span style="vertical-align:middle;">{{info.name}}</span>
                    </div>
                </router-link>
                <a style="position:relative;" @click="handleCollect(info._id)">
                    <div class="heart">
                        <div class="heart1" :class="{backgroundred:isClicked}"></div>
                        <div class="heart2" :class="{backgroundred:isClicked}"></div>
                    </div>
                    <div style="margin-left:20px;">{{info.hotnums}}
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import {toggleCollection} from "@/service/api"
export default {
    props:{
        info:{
            type:Object,
            default:()=>({})
        }, 
    },
    data(){
        return {
            userInfo:this.$store.state.userInfo,
            isClicked:'false',
        }
    },
    watch:{
        info:{
            handler(newVal){
                if(newVal){
                    this.isClicked = newVal.isClicked;
                }
            },
            immediate:true
        }
    },
    methods:{
        async handleCollect(artId){
            if(this.userInfo._id==undefined) {
                this.$message({
                    message:"请先登录！",
                    type:"warning"
                });
                await this.delay(1500);
                window.location="/login";return ;
            }
            
            let data = await toggleCollection({userId:this.userInfo._id,artId});
            //console.log("关注事件：",data.mes);
            
            if(data.code===0){
                this.info.hotnums = data.data.collection_len;
                this.isClicked=!this.isClicked;
            }
        },
        delay(t){return new Promise(r=>setTimeout(r,t));},

    }
}
</script>

<style lang="stylus">
.heart
    position absolute
    transform rotate(-45deg)
.heart1
    height 5px
    width:10px
    border-top-left-radius:5px
    border-top-right-radius:5px
    border 1px solid black
    border-bottom none
.heart2
    height 10px
    width 15px
    border-top-right-radius:5px
    border-bottom-right-radius:5px
    border 1px solid black
    border-top none
.backgroundred
    background-color red
</style>