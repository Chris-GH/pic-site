<template>
    <div>
        <div class="space-header">
            <div class="space-avatar">
                <el-avatar :size=" 100" :src="this.userInfo.avatar"></el-avatar>
                <div class="space-info">
                    <div class="fontnormal">{{this.userInfo.name}}</div>
                    <div>s站号:{{this.userInfo._id}}</div>
                    <div><i :class="{'el-icon-male':this.userInfo.gender==='male','el-icon-female':this.userInfo.gender==='female'}" ></i><span class="space-tag">{{this.userInfo.address}}</span></div>
                </div>
            </div>
            <div class="space-sign fontnormal">{{this.userInfo.sign}}</div>
            <ul class="space-more fontnormal">
                <li>
                    <div>
                        <div>关注</div>
                        <strong>{{this.userInfo.follows.length}}</strong>
                    </div>
                </li>
                <li>
                    <div>
                        <div>粉丝</div>
                        <strong>{{this.userInfo.fans.length}}</strong>
                    </div>
                </li>
                <li>
                    <div>
                        <div>收藏</div>
                        <strong>{{this.userInfo.collections.length}}</strong>
                    </div>
                </li>
            </ul>
            <span v-if="!isOwner" class="follow" :class="{active:!isFollow}" @click="handleFollow">{{ isFollow ? '已关注' : '关注' }}</span>
            <span v-else class="follow active"  @click="handleEdit">编辑资料</span>
        </div>
        <div class="space-body">
            <!-- 详情展示区 -->
            <el-tabs class="user-nav" v-model="activeName" @tab-click="tabClickHandler">
                <el-tab-pane label="作品" name="spaceworks"></el-tab-pane>
                <el-tab-pane label="粉丝" name="fans"></el-tab-pane>
                <el-tab-pane label="关注" name="following"></el-tab-pane>
                <el-tab-pane label="收藏" name="collection"></el-tab-pane>
            </el-tabs>
            <!-- 二级路由 -->
            <div class="space-show">
                <router-view :lists="list" :activeName="activeName"></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import {userInfo} from "@/service/api";
import {toggleFollow} from "@/service/api"
import {getCollections} from "@/service/api"
import {getFans} from "@/service/api"
import {getFollows} from "@/service/api"
import {getWorks} from "@/service/api"

const getOtherInfo = {
  async fans(params){  // 粉丝
    return (await getFans(params)).data;
  },
  async following(params){  // 粉丝
    return (await getFollows(params)).data;
  },
  async collection(params,obj){ // 收藏
    let list = (await getCollections(params)).data;
    const userInfo = obj.$store.state.userInfo;
    if(userInfo.collections!==undefined){
        const collections = userInfo.collections;
        list.forEach(element => {
            if(!collections.find(elem=>elem===element._id)){
                element.isCliked = false;
            }
            else{
                element.isCliked = true;
            }
        });
        
    }
    else
        list.forEach(element => {
            //console.log("undefined...");
            element.isCliked = false;
        });
    return list;
  },
  async spaceworks(params){  // 粉丝
    return (await getWorks(params)).data;
  },
}

export default {
    data(){
        return {
            isFollow:false,
            activeName:'spaceworks',
            userInfo:{
                fans:[],
                collections:[],
                follows:[]
            },
            list:[],
            queen:{}
        }
    },
    watch:{
        $route: {
        async handler(){
            if(this.userInfo._id==null){
                let {authorId} = this.$route.query;//获取请求
                let userId = this.$store.state.userInfo._id;
                if(userId==undefined){this.isOwner=false;}
                else if(authorId){ 
                    this.isOwner = authorId === userId;//!userId || userId === this.$store.state.userInfo.userId;不知道在考虑什么
                    if(this.isOwner) {// 当前登录的用户
                        this.userInfo = this.$store.state.userInfo;
                        console.log("isOwner",this.userInfo);
                    }else {// 别人空间
                        const data = await userInfo({userId:authorId});
                        this.userInfo = data.data;
                        //console.log("space",data.data);
                        
                        if(this.$store.state.userInfo.follows.find(element=>element===authorId))
                            this.isFollow = true;
                        else
                            this.isFollow = false;
                        
                    }
                }else {
                    this.$message({
                        showClose: true,
                        message: '请重新进入',
                        type: 'warning'
                    });
                }
            }
            this.activeName = this.$route.name;
            this.getInfo();
        },
        immediate: true
        }
    },
    methods:{
        async getInfo(){
            (async (activeName) => {
                //console.log("点击路由",this.activeName);
                let data = await getOtherInfo[activeName]({userId: this.userInfo._id},this);
                this.queen[activeName] = data;
                if(activeName === this.activeName){
                    this.list = this.queen[this.activeName];
                }
                this.queen = {};
            })(this.activeName)
        },
        async handleFollow(){
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
                        let data = await toggleFollow({authorId:this.userInfo._id});
                        if(data.code===0){
                            this.isFollow=!this.isFollow;
                            //console.log("success",data.mes);
                        }
                    }).catch(() => {

                    });
                }
            else      
            {let data = await toggleFollow({authorId:this.userInfo._id});
            if(data.code===0){
                 this.isFollow=!this.isFollow;
                //console.log("success",data.mes);
            }}
        },
        delay(t){return new Promise(r=>setTimeout(r,t));},
        tabClickHandler(){
            this.$router.push({
                name: this.activeName,
                query: {
                ...this.$route.query//需要带userId的参数
                }
            })
        },
        handleEdit(){
            this.$router.push({
                name: 'edit',
            })
        }
    }
}
</script>

<style lang="stylus">
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
.space-avatar
    height 100px
    margin-bottom 20px
.el-avatar    
    vertical-align middle
.space-info
    display inline-block
    vertical-align middle
    padding-left 20px
    div
        margin-bottom 5px
    .el-icon-male
        color red
        padding 2px 5px 2px 5px
        text-align center
        border-radius 5px
        background-color #ddd
        cursor pointer
        margin-right 5px
    .el-icon-female
        color red
        padding 2px 5px 2px 5px
        text-align center
        border-radius 5px
        background-color #ddd
        cursor pointer
        margin-right 5px
.space-tag
    color white
    padding 2px 5px 2px 5px
    text-align center
    border-radius 5px
    background-color #ddd
    cursor pointer
    margin-right 5px
.space-more
    display inline-block
    &::after
        content ""
        display block
        height 0
        clear both
        visibility hidden
        overflow hidden
    li
        float left
        padding-left 8px
        padding-right 8px
        border-radius 4px
.fontnormal
    font-size 14px
.user-nav
    margin 20px 0 20px 0
.el-tabs__item.is-active 
    color #ff3232
.el-tabs__active-bar
    background-color #ff3232
.el-tabs__nav-wrap::after
    background-color transparent
.user-info-show
    min-height 300px
    background #fff
    padding-top 20px
</style>