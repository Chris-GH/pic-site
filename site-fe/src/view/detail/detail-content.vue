<template>
    <div class="detail-content">
        <div class="carousel">
            <div class="carbox" ref="carbox">
                <img 
                v-for="item,index in info.pic_url"
                :key="index" 
                :src="item"/>
            </div>
            <a class="btn_left" @click="lBtnclick"><i class="el-icon-arrow-left"></i></a>
            <a class="btn_right" @click="rBtnclick"><i class="el-icon-arrow-right"></i></a>
        </div>
        <div class="dotty">
            <i 
                v-for="item in imgslen"
                :key="item"
                :class="{carsgle_i:contr==item}" >
            </i>
        </div>
        <h3 class="text-title">{{info.title}}</h3>
        <p class="text-content">
            {{info.writing}}
        </p>
        <span class="text-tips" v-for="item,index in info.tags" :key="index">#{{item}}</span>
        <p class="text-time">{{this.createdAt}}</p>
    </div>
</template>

<script>
export default {
    props:{
        info: {
            type: Object,
            default: () => ({pic_url:['asd','dd']})
        }
    },
    mounted(){
        //console.log("mounted",this.info);
        let imgslen = this.info.pic_url.length;
        this.$refs.carbox.style.width = imgslen * 400 + "px";
    },
    data(){
        return{
            contr:'1',
            imgslen:0,
            createdAt:''
        }
    },
    watch:{
        info:{
            handler(newVal){
                if(newVal){
                    this.createdAt = newVal.createAt.slice(0,10);
                    this.imgslen = this.info.pic_url.length;
                }
            },
            immediate:true
        }
    },
    methods:{
        lBtnclick(){
            if(this.contr===1)return;
            this.contr--;
            this.$refs.carbox.style.transitionDuration = "0.5s";
            this.$refs.carbox.style.transform = "translateX(-" + (this.contr-1)*400 +"px)";
        },
        rBtnclick(){
            if(this.contr===this.imgslen)return;
            this.contr++;
            this.$refs.carbox.style.transitionDuration = "0.5s";
            this.$refs.carbox.style.transform = "translateX(-" + (this.contr-1)*400 +"px)";
        }
    }
}
</script>

<style lang="stylus">
.carousel
    position relative
    width 400px
    overflow hidden
    margin 0 auto 0
.carbox
    display flex
.carousel img
    width 400px
.btn_left
    position absolute
    top 50%
    width 25px
    height 35px
    line-height 35px
    background-color #d9d9d9
    left 0px
    border-top-right-radius 18px
    border-bottom-right-radius 18px
    font-size 20px
    z-index 2
    opacity .5
    -webkit-transition background-color .2s ease
    transition background-color .2s ease
.btn_left:hover
    background-color #eeeeee
    opacity 1
.btn_right
    position absolute
    top 50%
    width 25px
    height 35px
    line-height 35px
    background-color #d9d9d9
    right 0px
    border-top-left-radius 18px
    border-bottom-left-radius 18px
    font-size 20px
    z-index 2
    opacity .5
    -webkit-transition background-color .2s ease
    transition background-color .2s ease
.btn_right:hover
    background-color #eeeeee
    opacity 1
.dotty
    text-align center
    
.dotty i
    position relative
    display inline-block
    width 4px
    height 4px
    border-radius 50%
    background #999
    -webkit-transition: background .2s ease
    transition: background .2s ease
    margin-right 5px
.carsgle_i
    background-color #e1251b !important
.text-content
    line-height 1.8
    font-size 14px
    color #111
    word-wrap break-word
    white-space pre-wrap
.text-title
    font-size 20px
    line-height 28px
    margin-bottom 20px
    font-weight 600
    color #111
.text-tips
    font-size 14px
    color #6698cd 
    background-color #ddd
    border-radius 10px
    padding 0 10px
    margin-right 0
.text-time
    font-size 10px
    color #777
</style>