import Vue from 'vue'
import Router from "vue-router";
Vue.use(Router);
//解决重复路由报错的问题
const orginalPush = Router.prototype.push;
Router.prototype.push = function push(location){
    return orginalPush.call(this,location).catch(err=>err)
}

import {userInfo} from '@/service/api';
import Store from '@/store'

import sHome  from '@/view/home.vue';
import  sNotfound  from "@/view/notfound"
import sLogin from "@/view/user-login"

const sUpload = ()=> import ("@/view/upload/upload");
const sUploadWorks = ()=> import ("@/view/upload/uploadworks");
const sDetail = ()=> import ("@/view/detail/detail");
const sEdit = ()=> import ("@/view/user-space/edit");
const sPagination = ()=> import ("@/view/pagination");
const sSpace = ()=> import ("@/view/user-space/space");

const sArtList = ()=> import ("@/view/user-space/artlist");
const sFans = ()=> import ("@/view/user-space/fans");
const sFollows = ()=> import ("@/view/user-space/follows");
const sCollections = ()=> import ("@/view/user-space/collections");

const router = new Router({
    mode:'history',
    routes:[{
        path:'/login',
        name:'login',
        title:'登录页',
        component:sLogin
    },
    {
        path:'/',
        name:'home',
        title:"home",
        component:sHome,
    }
    ,
    {
        path:'/upload',
        name:'upload',
        title:"上传页",
        component:sUpload,
        meta: {
            login: true
        },
        children: [
            {
                path: 'works',
                name: 'works',
                title: '作品',
                component: sUploadWorks,
                meta: {
                    login: true
                },
            },
        ]
    }
    ,
    {
        path:'/detail',
        name:"detail",
        title:"详情页",
        component:sDetail
    },
    {
        path:'/edit',
        name:"edit",
        title:"修改页",
        component:sEdit
    },
    {
        path:'/pagination',
        name:"pagination",
        title:"分页",
        component:sPagination
    },
    {
        path:'/space',
        name:"space",
        title:"用户个人信息",
        component:sSpace,
        redirect: {
            name: 'spaceworks'
          },
        children: [
            {
                path: 'works',
                name: 'spaceworks',
                title: '作品',
                component: sArtList,
                meta: {
                    login: true
                },
            },
            {
                path: 'fans',
                name: 'fans',
                title: '我的粉丝',
                component: sFans,
                meta: {
                    login: true
                },
            },
            {
                path: 'following',
                name: 'following',
                title: '我的关注',
                component: sFollows,
                meta: {
                    login: true
                },
            },
            {
                path: 'collection',
                name: 'collection',
                title: '收藏',
                component: sCollections,
                meta: {
                    login: true
                },
            }
        ]
    },
    {
        path:'*',
        name:"notFound",
        title:"unfind",
        component:sNotfound
    }
    ]
});

router.beforeEach(async (to,from,next)=>{
    //console.log("进入router的拦截器");
    const token = localStorage.getItem('token');
    //console.log("前端保存的token",token);
    const isLogin = !!token;//若之前保存有token，就可以免登陆,这样设计是没问题的
    let data = {};
    if(isLogin){
        data = await userInfo();//这一步后端需要验证token
        Store.commit('changeUserInfo',data.data);//console.log("数据加载完成");console.log(data);
    } 
    if(to.matched.some(item=>item.meta.login)){//需要登录时
        console.log("需要登录");
        if(isLogin){//携带了token
            if(data.error === 400){
                next({name:'login'});
                localStorage.removeItem('token');
                return ;
            }
            if(to.name === 'login'){
                next({name:'home'})
            }else{next();}

            return;
        }

        //没登录，进入的不是login，跳到login
        if(!isLogin&& to.name !== 'login'){
            next({name:'login'})
        }

        // 没登录，进入login，直接进入
        if(!isLogin && to.name === 'login'){console.log("next 进入 login组件");
            next();
        }
    }
    else {console.log("不需要登录");next();}
    console.log("结束");
});

export default router;