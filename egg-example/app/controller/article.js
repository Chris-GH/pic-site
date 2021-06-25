'use strict';
const host = 'http://127.0.0.1:7001'

const Controller = require('egg').Controller;

class ArticleController extends Controller {
  async publish() {
    const { ctx,service } = this;
    const payload = ctx.request.body || {};
    let ownId = '';
    if(ctx.request.header.authorization){
      let authorization = ctx.request.header.authorization.split(' ')[1];
      let decode = ctx.app.jwt.decode(authorization);
      ownId = decode.data._id;
    }
    const findUser = await service.user.findUser({_id: ownId});
    payload.name = findUser.name;
    payload.authorId = findUser._id;
    const menu = await service.article.publish(payload);
    const newtag = await service.article.addtags(payload.tags);
    ctx.body = {
      code: 0,
      data:{...payload},
      mes: '发布成功'
    }
  }

  async gettags() {
    const { ctx } = this;
    const tags = await ctx.model.Tags.find().select('name').select('-_id').limit(15);
    ctx.body = {
      code:0,
      data:{
        tags:tags
      }
    }
  }

  async query() {
    const { ctx,service } = this;
    const payload = ctx.request.query || {};//直接获取get请求中的参数
    if(payload.artId){
      let art = await service.article.getInfo(payload.artId);
      ctx.body = {
        code: 0,
        data:art,
        mes: '文章获取成功'
      };
      return ;
    }
    //console.log("查询参数",payload);

    const otherData = {page:0};
    // property 是一个json字符串
    if(payload.property){
      const property = JSON.parse(payload.property);
      Object.keys(property).forEach((key) => {
        payload[`property.${key}`] = property[key];
      });
      delete payload.property
    }
    if(payload.page) otherData.page = payload.page;

    if(isNaN(+otherData.page)){
      ctx.body = {
        code: 1,
        data: {},
        mes: '分页不为数字，请重新填写'
      };
      return;
    }
    const query = {
      ...payload,
      page: null
    }
    //console.log("为啥为负数呢",otherData.page)
    let arts = await service.article.query(query,otherData);
    await ctx.helper.sleep(1000);
    ctx.body = {
      code: 0,
      data: {
        ...arts,
      },
      mes: '文章获取成功'
    };
  }

  async comment() {
    const { ctx,service } = this;
    if(ctx.request.method === 'GET'){
      const payload = ctx.request.query || {};
      const commentInfo = await service.article.getComment(payload);   
      return ctx.body = {
        ec: 200,
        data: commentInfo,
        mes: '成功返回评论'
      };
    }
    const payload = ctx.request.body || {};
    let ownId = '';
    if(ctx.request.header.authorization){
      let authorization = ctx.request.header.authorization.split(' ')[1];
      let decode = ctx.app.jwt.decode(authorization);
      ownId = decode.data._id;
    }
    payload.writerId = ownId;
    payload.writerInfo = payload.writerId;
    const commentInfo = await service.article.comment(payload);
    ctx.body = {
      ec: 200,
      data: {
        comments: commentInfo,
        artId: payload.artId
      },
      mes: '评论成功'
    };
  }

  async getranks() {
    const { ctx,service } = this;
    const ranks = await service.article.getranks();
    ctx.body = {
      ec: 200,
      data: ranks,
      mes: 'ranks返回成功'
    };
  }

  async querybyhot() {
    const { ctx,service } = this;
    const otherData = {page:0};
    const payload = ctx.request.query||{};
    // property 是一个json字符串
    if(payload.property){
      const property = JSON.parse(payload.property);
      Object.keys(property).forEach((key) => {
        payload[`property.${key}`] = property[key];
      });
      delete payload.property
    }
    if(payload.page) otherData.page = payload.page;

    if(isNaN(+otherData.page)){
      ctx.body = {
        code: 1,
        data: {},
        mes: '分页不为数字，请重新填写'
      };
      return;
    }
    const query = {
      ...payload,
      page: null
    }
    //console.log("为啥为负数呢",otherData.page)
    let arts = await service.article.querybyhot(query,otherData);
    await ctx.helper.sleep(1000);
    ctx.body = {
      code: 0,
      data: {
        ...arts,
      },
      mes: '文章获取成功'
    };
  }
}

module.exports = ArticleController;
