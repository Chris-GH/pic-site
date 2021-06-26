<template>
  <div class="comment-box">
    <div class="split"></div>
    <span class="text-time">共{{comments.length}}条评论</span>
    <div  v-if="!isLogin">请先登录后，再评论<router-link :to="{name:'login'}">登录</router-link></div>
    <div class="cmt-input" v-if="isLogin">
      <img :src="owner.avatar"><textarea class="cmt" placeholder="发表你的惊人评论吧~" v-model="commentText"></textarea><el-button 
            class="send-comment" 
            type="primary" 
            size="small"
            @click="send"
          >提交</el-button>
    </div>
    <div class="cmted" v-for="item,index in comments" :key="index">
      <img :src="item.writerInfo.avatar">
      <div class="cmted-text"><p style="color:#777;margin:0;">{{item.writerInfo.name}}</p>
      
        <div style="display:flex;">
          <p style="flex:12;">{{item.commentText}}<span class="cmted-time">{{item.createdAt}}</span></p>
          <div style="flex:3;"></div>
          <a style="position:relative;flex:1;" @click="handleCollect($event,item._id)">
            <div class="heart">
              <div class="div1" :class="{red:item.isClicked}"></div><div class="div2" :class="{red:item.isClicked}"></div><div class="div3" :class="{red:item.isClicked}"></div>
            </div>
            <div style="margin-top:20px" id="hotnums">{{item.hotnums}}</div>
          </a>
        </div>
        <div class="split"></div>
      </div>
    </div>
      
    
  </div>
</template>

<script>
import {getComments,postComment,toggleComment} from '@/service/api';

export default {
    props:{
      info: {
            type: String,
            default: () => ''
        }
    },
    data(){
        return {
            owner:this.$store.state.userInfo,
            isCollection:false,
            commentText: '',
            comments: [],
        }
    },
    computed: {
      isLogin(){
        return this.$store.getters.isLogin;
      }
    },
    async mounted(){
      let {artId} = this.$route.query;
      if(artId){
        let data = await getComments({artId: artId});
        this.comments = data.data;
        //console.log("data",data);
      }
    },
    methods:{
      async send(){
        //console.log('发送')
        let data = await postComment({artId: this.info, commentText: this.commentText});
        console.log(data.data);
        this.comments.unshift(data.data.comments);
        this.commentText = '';
        
      },
      async handleCollect(e,commentId){
            let node = e.currentTarget;
            if(this.owner._id==undefined) {
                this.$message({
                    message:"请先登录！",
                    type:"warning"
                });
                await this.delay(1500);
                window.location="/login";return ;
            }
            
            let data = await toggleComment({userId:this.owner._id,commentId});
            //console.log("关注事件：",data.mes);
            
            if(data.code===0){
              //console.log("点击冒泡",node);
              node.querySelector(".div1").classList.toggle("red");
              node.querySelector(".div2").classList.toggle("red");
              node.querySelector(".div3").classList.toggle("red");
              node.querySelector("#hotnums").innerHTML=data.data.hotnums;
              //console.log("回调",data.data.hotnums)
            }
        },
        delay(t){return new Promise(r=>setTimeout(r,t));},
    }
}
</script>
<style lang="stylus">
.split
  width 100%
  border-bottom 1px solid #ddd
  margin 10px 0 10px 0
.text-time
  font-size 10px
  color #111
.cmt-input
  margin 10px 0 20px 0
.cmt-input img
  margin-right 10px
  height 30px
  width 30px
  border-radius 15px
  vertical-align middle
.cmt
  vertical-align middle
  padding 4px
  border none
  outline none
  margin-left 20px
  background-color white
  border-radius 15px
  height 22px
  width 80%
.cmted
  display flex
.cmted img
  margin-right 10px
  height 30px
  width 30px
  vertical-align top
.cmted-text
  flex 1
  font-size 12px
  vertical-align top
.cmted-time
  color #777
  margin-left 6px
.heart
  color red
  position absolute
  transform rotate(-45deg)
.div1
  height 6px
  width 12px
  border 1px solid red
  border-radius 6px 6px 0 0
  border-bottom none
.div2
  height 12px
  width 12px
  border-left 1px solid red
  border-bottom 1px solid red
.div3
  position absolute
  top 6px
  left 12px
  height 12px
  width 6px
  border-radius 0 6px 6px 0
  border 1px solid red
  border-left none
.red
  border none
  background-color red
.send-comment
  background-color #ff3232
  border none
  display inline-block
  &:hover
    background #ff3232
</style>