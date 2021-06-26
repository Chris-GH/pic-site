<template>
    <div>
        <div class="searchcolumn">
            <div class="pagetap">
                <ul style="display:flex;">
                    <li class="tapli">
                        <a href="/">
                            <div class="round">
                                <i class="el-icon-s-home"></i>
                            </div>
                            <span>首页</span>
                        </a>
                    </li>
                    <li class="tapli">
                        <a>
                            <div class="round">
                                <i class="el-icon-s-promotion"></i>
                            </div>
                            <span>收信</span>
                        </a>
                    </li>
                    <li class="tapli">
                        <a>
                            <div class="round">
                                <i class="el-icon-camera"></i>
                            </div>
                            <span>美图</span>
                        </a>
                    </li>
                    <li class="tapli">
                        <a>
                            <div class="round">
                                <i class="el-icon-video-play"></i>
                            </div>
                            <span>视频</span>
                        </a>
                    </li>
                </ul>
            </div>
            <span class="split-x"></span>
            <div class="searchbox">
                <input v-model="searchText" type="text" class="searchipt" placeholder="火影忍者" @keyup.enter="search"/>
                <el-button
                    type="danger"
                    icon="el-icon-search"
                    @click="search"
                    >
                </el-button>
            </div>
        </div>
        <div class="tags-column">
            <span class="split-x"></span>
            <div style="display:flex;flex-direction: column;height: 68px;width:540px;flex-wrap:wrap;">
                <a  style="height:34px;display: flex;align-items: center;"
                    v-for="(item,index) in tags"
                    :key="index"><span style="font-size:14px;">{{item.tag}}</span><em class="tags-num">{{item.num}}+</em>
                </a>
            </div>
            <span class="split-x"></span>
        </div>
        <div class="piccolumn">
            <cardlist :lists="artlist" @refresh="freshbanner"></cardlist>
            <picrank :info="ranks"></picrank>
        </div>
    </div>
</template>

<script>
import Cardlist from "@/components/cardlist"
import Picrank from "@/components/picrank"
import {getTags,getRanks} from "@/service/api"
import {getBanner,freshBanner} from "@/service/api"
export default {
    name:"sHome",
    components:{Cardlist,Picrank},
    data(){
        return {
            userInfo:this.$store.state.userInfo,
            tags:[],
            page: 1,
            artlist:[],
            searchText:'',
            ranks:[]
        }
    },
    mounted(){
        getTags().then(data=>{
            // this.tags = data.data.tags.map(item=>{
            //     return item.name;
            // });
            this.tags = data.data.tags.map(item=>{
                return {tag:item.name,num:0};
            });
        });//这个都是异步的，可能会有问题，因为接下来要用tags

        getBanner().then(data=>{
            const list = data.data.list;
            //console.log("tags ready",this.tags);
            list.forEach(element => {
                element.tags.forEach(elem=>{
                    let obj = this.tags.find(item=>item.tag === elem);
                    obj.num++;
                })
            });
            this.artlist = list;
        });

        getRanks().then(data=>{
            this.ranks = data.data;
            //console.log(data.data);
        });
    },
    methods:{
        search(){
            if(this.searchText==='')return;
            this.$router.push({
                name: 'pagination',
                query:{
                    tags:this.searchText,
                }
            })
        },
        freshbanner(){
            freshBanner({page:this.page++}).then(data=>{
                const list = data.data.list;
                //console.log("tags ready",this.tags);
                list.forEach(element => {
                    element.tags.forEach(elem=>{
                        let obj = this.tags.find(item=>item.tag === elem);
                        obj.num++;
                    })
                });
                this.artlist = list;
                this.artlist.push(0);
                this.artlist.pop();
            })
        }
    }
}
</script>

<style lang="stylus">
.searchipt
    overflow hidden
    height 38px
    width 400px
    border none
    background-color white
    box-shadow none
    color #999
    font-size 14px
    line-height 34px
    border-radius 2px
    outline none
    vertical-align middle
.searchcolumn
    display flex
    justify-content center
.tapli
    height 60px
    width 50px
    text-align center
    border-radius 16px
.round
    position relative
    background #ff5c7c
    border-radius 36px
    width 36px
    height 36px
    text-align center
    line-height 36px
    margin 0 auto 5px
    font-size 28px
.searchbox
    margin auto 0 auto 10px
.split-x
    height 50px
    border-left 1px solid #777
    margin 0 10px 0 10px
    margin auto 0
.piccolumn
    display flex
    justify-content space-between
    margin-bottom 40px
.tags-num
    font-style normal
    font-size 12px
    background #73c9e5
    border-radius 2px
    color #fff
    margin-left 1px
    transform scale(1)
    width 32px
    text-align center
    height 14px
.tags-column
    display flex
    justify-content center
</style>