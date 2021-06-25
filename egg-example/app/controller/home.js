'use strict';
const host = 'http://127.0.0.1:7001'

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async uploadstream () {
    const { ctx } = this;
    //const {type} = ctx.request.query;//- product user step
    const type = "img";
    // 如果没有传type或者传入的type不对，则提示
    // if(!type || !ctx.upload[type]){
    //   return ctx.body = {
    //     code: 1,
    //     data:{},
    //     mes: '请上传正确的type类型'
    //   }
    // }

    const fileOptions = ctx.upload[type];
    const stream = await ctx.getFileStream();
    const info = await ctx.helper.writeStreamToDisk(stream, fileOptions);

    if(info.error){
      return ctx.body = {code: 1,data:{},mes: info.mes}
    }
    ctx.body = {
      code: 0,
      data:{
        url: host + info.accessPath
      },
      mes: '上传图片成功'
    }
  }

  async uploadfilesingle () {
  }

  async uploadfiles () {
    console.log("后端上传空间files");
    const { ctx } = this;
    console.log(ctx.request.body);
    console.log('got %d files', ctx.request.files.length);
    for (const file of ctx.request.files) {
      console.log('field: ' + file.fieldname);
      console.log('filename: ' + file.filename);
      console.log('encoding: ' + file.encoding);
      console.log('mime: ' + file.mime);
      console.log('tmp filepath: ' + file.filepath);
      let result;
      try {
        // 处理文件，比如上传到云端
        result = "end";
        ctx.body={data:"success"};
        //result = await ctx.oss.put('egg-multipart-test/' + file.filename, file.filepath);
      } finally {
        // 需要删除临时文件
        //await fs.unlink(file.filepath);
      }
      console.log(result);
    }
  }

  async banner(){
    const { ctx,service } = this;
    const arts = await service.article.query({},{page:1});
    ctx.body = {
      code: 0,
      data:{
        list: arts.list.slice(0,8)
      },
      mes: 'banner返回成功'
    }
  }
  
  async freshbanner(){
    const { ctx,service } = this;
    const {page} = ctx.request.query;
    const arts = await service.article.query({},{page:page});
    ctx.body = {
      code: 0,
      data:{
        list: arts.list.slice(0,8)
      },
      mes: 'banner更新返回成功'
    }
  }
}

module.exports = HomeController;
