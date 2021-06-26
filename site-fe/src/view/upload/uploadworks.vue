<template>
    <div>
        <el-container>
            <el-header class="header">
                <a class="classify" v-for="item,index in classifies" :key="index"
                    @click="clickHandler(index)"
                    :class="{'hover':index===classify}"><span>{{item}}</span></a>  
            </el-header>
            <el-main>
                <div class="imgupload">
                    <div style="display:inline-block;"
                        v-for="item,index in imgsrc"
                        :key="index">
                        <img style="width:150px;height:150px;margin-right:10px;"
                        :src="item"/>
                        <el-progress
                            style="width:150px;"
                            :percentage="percentagearr[index]"
                            :text-inside="true"
                            :stroke-width="15"
                            status="success">
                        </el-progress>
                    </div>
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="/api/upload"
                        :show-file-list="false"
                        :auto-upload="true"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :http-request="handleRequest"
                        :on-change="handleChange"
                        multiple
                        :limit="10"
                        :on-exceed="handleExceed"
                        :file-list="fileList"
                        drag>
                        <svg class="svgarea" width="100px" height="100px" viewBox="0 0 200 200">
                            <path     
                                fill="#777"
                                d="
                                    M 99 99
                                    V 80
                                    A 1 1 0 0 1 101 80
                                    V 99
                                    H 120
                                    A 1 1 0 0 1 120 101
                                    H 101
                                    V 120
                                    A 1 1 0 0 1 99 120
                                    V 101
                                    H 80
                                    A 1 1 0 0 1 80 99
                                    H 99
                                    Z"></path>
                            <path     
                                fill="none"
                                stroke="#777"
                                stroke-width="2px"
                                d="
                                    M 2 8
                                    A 6 6 0 0 1 8 2
                                    H 192
                                    A 6 6 0 0 1 198 8
                                    V 192
                                    A 6 6 0 0 1 192 198
                                    H 8
                                    A 6 6 0 0 1 2 192
                                    V 8
                                    Z"></path>
                        </svg>
                        
                    </el-upload>
                </div>
                <div class="split"></div>
                <el-input
                    type="textarea"
                    :rows="1"
                    :cols="50"
                    placeholder="填写标题会更容易让大家搜索到哦~"
                    v-model="params.title"
                    >
                </el-input>
                <div class="split"></div>
                <el-input
                    type="textarea"
                    :rows="5"
                    :cols="50"
                    placeholder="添加正文~"
                    v-model="params.writing"
                    >
                </el-input>
                <div class="split"></div>
                <div class="tips">
                    <div style="margin-bottom:5px;">
                        <span><i class="el-icon-price-tag"></i>添加一个标签<el-input class="tag-text" size="small" maxlength="12" :rows="1" v-model="atag" placeholder="标签" suffix-icon="el-icon-price-tag"></el-input><button @click="addtag(atag)">add</button></span>
                    </div>
                    <span style="margin:0;">选择合适的标签</span>
                    <i class="el-icon-arrow-right" style="margin-right:10px;"></i>
                    <span class="tags"
                        v-for="item,index in tips"
                            :key="index">
                        <span>{{item}}</span><i class="delete-icon el-icon-close" @click="remove(index)"></i>
                    </span>
                </div>
                <div class="wsubmitbox">
                    <a class="wsubmit" @click="submitHandler">上传文章</a>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import axios from 'axios';
import {publish} from "@/service/api";
export default {
    name:'uploadworks',
    data(){
        const userInfo = this.$store.state.userInfo;
        return {
            classifies:["视频投稿","图片投稿"],
            classify:0,
            fileList: [],
            imgsrc:[],
            percentagearr:[],
            num:0,
            isCommited:false,
            tips:[],
            imgurl:[],
            atag:'',
            params:{
                title:'mytile',
                pic_url:[],
                writing:'我是一个小古灵精怪，每天瞎开心！',
                tags:[],
                avatar:userInfo.avatar,
            }
        }
    },
    mounted(){
        this.$refs.upload.$el.getElementsByClassName("el-upload-dragger")[0].classList.remove("el-upload-dragger");   
    },
    methods:{
        clickHandler(index){
            this.classify=index;
        },
        submitHandler(){
            if(this.isCommited){
                this.$message({
                    message:"不可以重复提交！",
                    type:"warning"
                })
            }else{
                let uploadone = this.percentagearr.every(item=>item===100);
                if(uploadone){
                    this.isCommited = true;
                    Object.assign(this.params.tags,this.tips);
                    Object.assign(this.params.pic_url,this.imgurl);
                    publish(this.params).then((data) => {
                        this.$message({
                            message: data.mes,
                            type: 'success'  
                        });
                        this.$router.push({
                            name: 'upload'
                        })
                    });
                    
                }
            }
            
        },
        handleRemove(file, fileList) {
            console.log("remove",file, fileList);
        },
        handlePreview(file) {
            console.log("touch",file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        handleChange(file,fileList){
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.imgsrc.push(fileReader.result);
                this.percentagearr.push(0);
            };

            fileReader.readAsDataURL(file.raw);
            console.log("change",file,fileList.length);
        },
        handleRequest(file){
            //console.log("send",file.file);
            !(function(n,obj){
                let formdata = new FormData();
                formdata.append("img",file.file);
                axios({
                    url:"/api/upload",
                    method:"post",
                    data:formdata,
                    headers:{'Content-Type':'multipart/form-data'},
                    onUploadProgress:e=>{
                        obj.percentagearr.splice(n,1,Math.floor(e.loaded/e.total*100));
                    }
                }).then(res=>{
                    if(res.data.code === 1){//res.data才是数据
                        obj.$message({
                        message: res.data.mes,
                        type: 'warning'
                        });
                        obj.imgsrc.pop();
                        obj.percentagearr.pop();
                        return;
                    }
                    obj.imgurl[n]=res.data.data.url;
                    obj.num++;
                    console.log("sucess",res.data);
                    
                },err=>{
                    console.log("err:",err);
                });
            })(this.num,this);
        },
        remove(index){
            this.tips.splice(index,1);
            //console.log("删除标签");
        },
        addtag(tag){
            if(tag===''){return;}//空格问题怎么解决?????????
            this.tips.push(tag);
            //console.log("增加",tag);
        }
    }
}
</script>

<style lang="stylus">
a.classify
    color rgb(0, 161, 214)
    font-weight bolder
    padding-top 5px
    margin-left 40px
    font-size 20px
    letter-spacing 0.5px
    line-height 40px
    display inline-block
.hover
    border-bottom 3px solid rgb(0, 161, 214)
.el-header.header
    width 780px
    background-color rgb(238, 241, 246)
    border-bottom 1px solid #777
.imgupload
    width 750px
.upload-demo
    display inline-block
.svgarea
    font-family PingFangSC-Regular,Microsoft YaHei,Arial,Helvetica,sans-serif
.wsubmitbox
    margin 30px auto 0
    width 200px
    height 44px
.wsubmit
    display block
    font-size 16px
    color #fff
    text-align center
    line-height 40px
    border-radius 4px
    background #00a1d6
    line-height 42px
.wsubmit:hover
    background #00aed6
.split
    width 700px
    border-bottom 1px solid #777
    margin 10px 0 10px 0

.tips 
    >   span 
        margin-right 10px
        font-size 14px
.tags
    border-radius 4px
    background-color #00aed6
    color white
    &:hover
        cursor pointer
.tag-text
    width 30%
    margin-left 10px
    color black
</style>