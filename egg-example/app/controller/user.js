'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const { ctx,service } = this;
    const payload = ctx.request.body || {};
    
    const findUser = await service.user.findUser({name: payload.name});
    if(!findUser) {
      ctx.body = {
        code: 1,
        mes: '用户输入错误，请重新输入'
      }
      return;
    }
    const result = await ctx.compare(payload.password, findUser.password);

    if(!result){
      ctx.body = {
        code: 1,
        mes: '密码输入错误，请重新输入'
      }
      return;
    }
    // 登录操作 发送个令牌给前端
    let token = await service.actionToken.apply(findUser._id);
    // 将令牌存储在数据库中
    await service.actionToken.saveToken({userId: findUser._id, token});

    ctx.body = {
      code: 0,
      data: {
        _id: findUser._id,
        name: findUser.name,
        token: token,
      },
      mes: '登录成功'
    }
  }

  async create(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};
    const findUser = await service.user.findUser({name: payload.name});
    
    if(findUser){
      ctx.body = {
        code: 1,
        mes: '用户已存在'
      }
      return;
    }

    await service.user.create(payload);
    
    ctx.body = {
        code: 0,
        mes: '用户已创建完成'
      }
  }

  //拿到用户信息
  async info(){
    const {ctx,service}=this;
    const payload = ctx.request.body || {};
    let userId = '';
    let authorization = ctx.request.header.authorization.split(' ')[1];
    let decode = ctx.app.jwt.decode(authorization);
    //console.log("解析token",decode);
    let ownerId = decode.data._id;//token中的id
    if(payload.userId){//当前端带参传递时，payload中含userId，按id进行查询即可
        userId=payload.userId;
    }else{
        userId = ownerId;//当前端不带参传递时，此时使用token中信息，说明查询的是token中的user信息
    }

    const findUser = await service.user.findUserInfo({_id:userId});
    let isFollowing = false;
    // if(payload.userId){
    //     const findOwner = await service.user.findUserFollowing({userId:ownerId});
    //     ifFollowing = !!findOwner.find(item=>item._id.toString() === userId);
    // }

    //const menus = await service.menu.query({userId:userId});
    if(!findUser){
        ctx.body = {  
            code: 1,
            data: {},
            mes: '用户不存在'
        }
        return;
    }
    ctx.body = {
        code: 0,
        data: {
          ...findUser,
        },
        mes: '用户已返回'
      }
  }

  async login_out(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};//空对象我下一步怎么删除token？？？
    //console.log("删除token",payload);是个空对象
    await service.actionToken.deleteToken({userId: payload._id});
    ctx.body = {
      code: 0,
      mes: '已登出'
    }
  }

  async edit(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};
    let userId = '';
    let authorization = ctx.request.header.authorization.split(' ')[1];
    let decode = ctx.app.jwt.decode(authorization);
    payload._id = decode.data._id;  // 自己的id
    const findUser = await service.user.changeUserInfo(payload);
    await service.article.changeArtInfo({userId: payload._id},{name: payload.name,avatar:payload.avatar});
    ctx.body = {
      code: 0,
      data:{},
      mes: '修改成功'
    }
    return;
  }

  async toggleCollection(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};
    const result = await service.user.toggleCollection(payload);
    ctx.body = {
        code: 0,
        data:{
          isCollection:result.isAdd,
          collection_len:result.hotnums
        },
        mes: result.isAdd?'已收藏':'已取消收藏'
      }
  }

  async toggleFollow(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};
    let authorization = ctx.request.header.authorization.split(' ')[1];
    let decode = ctx.app.jwt.decode(authorization);
    payload.userId = decode.data._id;
    const result = await service.user.toggleFollow(payload);
    ctx.body = {
        code: 0,
        data:{
          isFollow:result.isFollow,
        },
        mes: result.isFollow?'已关注':'已取消关注'
      }
  }

  async toggleComment(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};
   
    const result = await service.user.toggleComment(payload);
    ctx.body = {
        code: 0,
        data:{
          hotnums:result.hotnums,
        },
        mes: result.isFollow?'已关注':'已取消关注'
      }
  }

  async getCollections(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};//post请求
    
    // 用户自己
    let collections = await service.user.getCollections(payload);

    payload.ownId = '';
    if(ctx.request.header.authorization){
      let authorization = ctx.request.header.authorization.split(' ')[1];
      let decode = ctx.app.jwt.decode(authorization);
      payload.ownId = decode.data._id;
    }
    if(payload.ownId!==''){
      let owncollections = await this.ctx.model.User.findOne({_id:payload.ownId}).select("collections");
      collections.forEach(element=>{
        if(!!owncollections.collections.find(elem=>elem.toString() === element._id.toString())){
          element.isClicked = true;
        }
      })
    }
    ctx.body = {
      code: 0,
      data:collections,
      mes: '返回收藏数据'
    }
  }

  async getWorks(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};//post请求
    payload.ownId = '';
    if(ctx.request.header.authorization){
      let authorization = ctx.request.header.authorization.split(' ')[1];
      let decode = ctx.app.jwt.decode(authorization);
      payload.ownId = decode.data._id;
    }
    // 用户自己
    let works = await service.user.getWorks(payload);

    if(payload.ownId!==''){
      let owncollections = await this.ctx.model.User.findOne({_id:payload.ownId}).select("collections");
      works.forEach(element=>{
        if(!!owncollections.collections.find(elem=>elem.toString() === element._id.toString())){
          element.isClicked = true;
          //console.log("有点击")
        }
      })
    }
    ctx.body = {
      code: 0,
      data:works,
      mes: '返回作品数据'
    }
  }

  async getFans(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};//post请求
    // 用户自己
    let fans = await service.user.getFans(payload);
    ctx.body = {
      code: 0,
      data:fans,
      mes: '返回粉丝数据'
    }
  }

  async getFollows(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};//post请求
    // 用户自己
    let follows = await service.user.getFollows(payload);
    ctx.body = {
      code: 0,
      data:follows,
      mes: '返回关注数据'
    }
  }
}

module.exports = UserController;
