<template>
    <div class="menu-list">
        <detail-header :info="articleInfo"></detail-header>
        <detail-content :info="articleInfo"></detail-content>
        <comment :info="artId"></comment>
    </div>
</template>

<script>
import DetailHeader from './detail-header'
import DetailContent from './detail-content'
import comment from './comment'
import {getArticles} from "@/service/api"

export default {
    components:{DetailHeader,DetailContent,comment},
    data(){
        return {
            articleInfo:{
                authorId:'',
                avatar:'',
                name:'',
                createAt:'',
                pic_url:[],
                tags:[],
                title: "",
                writing:'',
                isFollow:false
            },
            artId:''
        }
    },
    watch:{
        $route: {
        handler(){
            let {artId} = this.$route.query;//获取请求
            this.artId = artId;
            if(artId) {  //发请求
                getArticles({artId}).then((res) => {
                    this.articleInfo = res.data;
                    //console.log("详细页",res.data);
                    if(this.$store.state.userInfo.follows.length!=0){
                        if(this.$store.state.userInfo.follows.find(element=>element===res.data.authorId))
                            this.articleInfo.isFollow = true;
                        else
                            this.articleInfo.isFollow = false;
                    }
                })
            }else {
                this.$message({//elem组件
                    showClose: true,
                    message: '请重新进入',
                    type: 'warning'
                });
            }
        },
        immediate: true
        }
    }
}
</script>