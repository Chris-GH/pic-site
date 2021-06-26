<template>
    <div>
        <div class="pagi-search">
            <a class="search-logo">小站|搜索</a>
            <div class="search-block">
                <div class="search-content">
                    <input type="text" class="search-input" v-model="word" @focus="showautocomplete" @blur="hiddenautocomplete" @keyup.enter="search">
                    <div class="search-suggest" ref="suggestion">
                        <ul class="suggest-ul" @click="autocomplete($event)">
                            <li v-for="item,index in suggestions" :key="index"
                                ><a>{{item}}</a></li>
                        </ul>
                    </div>
                </div>
                <div class="search-button">
                    <el-button
                        @click="search"
                        type="primary"
                        icon="el-icon-search"
                        >搜索
                    </el-button>
                </div>
            </div>
        </div>
        <div class="navigator">
            <div>
                <ul class="choose-ul">
                    <li><a>综合<span>99+</span></a><div ref="slider" class="slider" ></div></li>
                    <li @mouseenter="changeX(1)" @mouseleave="backX(1)"><a>图片<span>99+</span></a></li>
                    <li @mouseenter="changeX(2)" @mouseleave="backX(2)"><a>视频<span>99+</span></a></li>
                </ul>
            </div>
        </div>
        <div class="filter">
            <ul class="filter-ul" @click="filterclass($event)">
                <li><a @click="filterdefault">综合排序</a></li>
                <li><a @click="filterhottest">最多赞</a></li>
                <li><a>最新发布</a></li>
                <li><a>默认</a></li>
            </ul>
            <div class="filter-bottom"></div>
        </div>
        <ul class="card-list">
            <li v-for="item,index in artlist" :key="index">
                <scard :info=item></scard>
            </li>
        </ul>
        <div style="text-align: center;" v-show="!loading">
          <el-pagination
            :hide-on-single-page= "pages.totalPages === 1 || !artlist.length"
            @size-change="changePage"
            @current-change="changePage"
            :current-page.sync="pages.currentPage"
            style="display: inline-block;"
            :page-size="pages.pageSize"
            background
            layout="total, prev, pager, next"
            :total="pages.total">
          </el-pagination>
        </div>
    </div>
</template>

<script>
import scard from "../components/card"

import {getArticles,getArtByhot} from "@/service/api"
export default {
    components:{scard},
    data(){
        return {
            userInfo:this.$store.state.userInfo,
            artlist:[],
            word:'',
            page:1,
            pages:{
                pageSize: 0,
                total: 0,
                currentPage: 0,
                totalPages: 0
            },
            loading: false,
            suggestions:[]
        }
    },
    methods:{
        getArticles(){
            // 调用loading
            let loading = null;
            this.$nextTick(() => {
                loading = this.$loading({
                target: '.filter-menus-box',
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
                });
            });
            this.artlist = [];  // 每次请求之前都清空
            this.loading = true;

            const query = {...this.$route.query};
            const params = {
                page: query.page || 1,
                tags: query.tags
            }
            //let {page,word} = this.$route.query;
            getArticles(params).then(data=>{
                this.artlist = data.data.list;
                if(loading) loading.close();
                this.loading = false;
                this.pages.pageSize = data.data.page_size;
                this.pages.total = data.data.total;
                this.pages.currentPage = data.data.current_page;
                this.pages.totalPages = Math.ceil(this.pages.total/this.pages.pageSize);
                //console.log("分页数据",this.pages);
            });
        },
        changeX(index){
            this.$refs.slider.classList.add(`class${index}`);
        },
        backX(index){
            this.$refs.slider.classList.remove(`class${index}`);
        },
        search(){
            if(!this.suggestions.find(item=>item===this.word))
                this.suggestions.unshift(this.word);
            this.$router.push({
            query: {
                tags:this.word,
                page:1
                }
            });
        },
        changePage(){
            this.$router.push({
            query: {
                ...this.$route.query,
                page: this.pages.currentPage
                }
            });
        },
        showautocomplete(){
            this.$refs.suggestion.style.display="block";
        },
        hiddenautocomplete(){
            
        },
        autocomplete(e){
            if(e.target.nodeName!=="A")return;
            //console.log("autocom",e.target.nodeName);
            this.word=e.target.innerHTML;
            this.$refs.suggestion.style.display="none";
        },
        filterclass(e){
            const target = e.currentTarget;
            console.log(target.childNodes);
            target.childNodes.forEach(element => {
                element.firstChild.classList.remove("a-active");
            });
            e.target.classList.add("a-active");
        },
        filterhottest(){
            // 调用loading
            let loading = null;
            this.$nextTick(() => {
                loading = this.$loading({
                target: '.filter-menus-box',
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
                });
            });
            this.artlist = [];  // 每次请求之前都清空
            this.loading = true;

            const query = {...this.$route.query};
            const params = {
                page: query.page || 1,
                tags: query.tags
            }
            getArtByhot(params).then(data=>{
                this.artlist = data.data.list;
                if(loading) loading.close();
                this.loading = false;
                this.pages.pageSize = data.data.page_size;
                this.pages.total = data.data.total;
                this.pages.currentPage = data.data.current_page;
                this.pages.totalPages = Math.ceil(this.pages.total/this.pages.pageSize);
                //console.log("分页数据",this.pages);
            });
        },
        async filterdefault(){
            this.getArticles();
        }
    },
    watch:{
        $route: {
        async handler(){
            this.getArticles();
        }
        ,
        immediate: true
        }
    }
}
</script>

<style lang="stylus">
.pagi-search
    height 44px
    margin 0 auto
    position relative
    width 587px
.search-logo
    width 131px
    height 35px
    float left
    margin-top 7px
    text-decoration none
    outline 0
    color #00a1d6
    cursor pointer
    font-size 16px
.search-content
    position relative
    background #fff
    border-radius 4px
    float left
    width 330px
    margin-right 10px
.search-input
    height 18px
    box-shadow none
    padding 11px 15px
    background transparent
    width 296px
    border 2px solid #ccd0d7
    border-radius 4px
    font-size 16px
    color #222
.search-suggest
    display none
    border 1px solid #e5e9ef
    position absolute
    width 327px
    border-radius 4px
    text-align center
    padding 10px 0
    color #222
    background #fff
    z-index 100
    overflow hidden
    margin-top 5px
    box-shadow 0 2px 4px rgba(0 0 0 .16)
.search-button
    width 90px
    cursor pointer
    float left
    .el-input
        color #fff
        font-size 16px
        letter-spacing 2px
        line-height 42px
        text-align center
        border-radius 4px
.suggest-ul
    margin 0
    padding 0
    a
        display block
        height 32px
        line-height 32px
        font-size 14px
        position relative
        text-align left
        white-space nowrap
        text-overflow ellipsis
        overflow hidden
        padding 0 20px
        margin 0 0 4px
        &:hover
            background-color #e5e9ef
.navigator
    display flex
    >div
        flex-grow 1
.choose-ul
    position relative
    li
        height 56px
        line-height 56px
        width 12.5%
        border-bottom 1px solid #ccd0d7
        box-sizing border-box
        display inline-block
        text-align center
        vertical-align middle
        white-space nowrap
    a
        color #000
        font-size 16px
        display block
        &:hover
            color #00a1d6
    span
        margin-left 6px
        font-size 12px
        color #6d757a
.slider
    position absolute
    top 54px
    border-bottom 2px solid blue
    width 90px
    transform translateX(0px)
    transition .3s
.class1
    transform translateX(130px)
    transition .3s
.class2
    transform translateX(260px)
    transition .3s
.filter
    padding 20px 0 11px
    width 100%
    position relative
    ul
        width 970px
        margin 0 0 10px 0
        &::after
            content ""
            display block
            height 0
            clear both
            visibility hidden
            overflow hidden
.filter-bottom
    width 100%
    height 1px
    background #777
    position absolute
    bottom 0
.filter-ul
    li
        float left
        padding-left 8px
        padding-right 8px
        border-radius 4px
        margin-right 15px
.a-active
    background-color #00a1d6
    color white
.card-list
    width 710px!important
    display flex
    flex-wrap wrap
    justify-content space-between
</style>