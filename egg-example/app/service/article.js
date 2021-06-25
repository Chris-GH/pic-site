const Service = require('egg').Service
const pageSize = 16;
class ArticleService extends Service {
  constructor(ctx){
    super(ctx);
  }

  async publish(payload){
    //console.log("发布文章啦");
    const { ctx } = this;

    // 错误的设置
    const article = await this.ctx.model.Article.create(payload);
    //console.log("让我看看",payload.authorId);
    let user = await this.ctx.model.User.findOne({_id:payload.authorId}).select("works");
    // console.log("让我看看",user);
    user.works.push(article._id);
    await user.save();
    return article;
  }

  async addtags(tags){
    for(let i=0;i<tags.length;i++){
      const exist = await this.ctx.model.Tags.findOne({name:tags[i]});
      if(exist) continue;
      await this.ctx.model.Tags.create({name:tags[i]});
    }
    return true;
  }

  async query(payload,otherData={page:0}){
    const {ctx} = this;
    const page = +otherData.page;
    const skip = (page-1) * pageSize;
    let query = ctx.helper.filterDef(payload);
    let queryList = this.ctx.model.Article.find(query).select('-__v');
    const total = await queryList.countDocuments();
    let list = await queryList.find().skip(skip).limit(pageSize);

    payload.ownId = '';
    if(ctx.request.header.authorization){
      let authorization = ctx.request.header.authorization.split(' ')[1];
      let decode = ctx.app.jwt.decode(authorization);
      
      payload.ownId = decode.data._id;
    }
    if(payload.ownId!==''){
      let owncollections = await this.ctx.model.User.findOne({_id:payload.ownId}).select("collections");
      list.forEach(element=>{
        if(!!owncollections.collections.find(elem=>elem.toString() === element._id.toString())){
          element.isClicked = true;
        }
      })
    }
    return {
      total: total,
      list:list,
      current_page: page,
      page_size: pageSize,
      current_page: page,
    }
  }

  async getInfo(artId){
    const art = await this.ctx.model.Article.findOne({_id:artId},'-__v -_id');
    return art;
  }

  async changeArtInfo(updateAttr,updateValue){
    const { ctx } = this;
    return await this.ctx.model.Article.updateMany({authorId: updateAttr.userId},updateValue);
  }

  async comment(payload){
    await this.ctx.model.Comment.create(payload);
    return await this.ctx.model.Comment.findOne(payload).populate({path: 'writerInfo', select: 'name _id avatar'});
  }

  async getComment(payload){
    const {ctx} = this;
    let list = await this.ctx.model.Comment.find(payload).sort({'_id':-1}).populate({path: 'writerInfo', select: 'name _id avatar'});
    payload.ownId = '';
    if(ctx.request.header.authorization){
      let authorization = ctx.request.header.authorization.split(' ')[1];
      let decode = ctx.app.jwt.decode(authorization);
      payload.ownId = decode.data._id;
    }
    if(payload.ownId!==''){
      let owncomments = await this.ctx.model.User.findOne({_id:payload.ownId}).select("comments");
      list.forEach(element=>{
        if(!!owncomments.comments.find(elem=>elem.toString() === element._id.toString())){
          element.isClicked = true;
        }
      })
    }
    return list;
  }

  async getranks(payload){
    const {ctx} = this;
    let title = ctx.model.Article.find({}).select("title -_id").sort({hotnums:-1}).limit(8);
    //const list = title._doc.map(item=>item.title);
    return title;
  }

  async querybyhot(payload,otherData={page:1}){
    const {ctx} = this;
    const page = +otherData.page;
    const skip = (page-1) * pageSize;
    let query = ctx.helper.filterDef(payload);
    let queryList = this.ctx.model.Article.find(query).select('-__v');
    const total = await queryList.countDocuments();
    let list = await queryList.sort({hotnums:-1}).find().skip(skip).limit(pageSize);

    payload.ownId = '';
    if(ctx.request.header.authorization){
      let authorization = ctx.request.header.authorization.split(' ')[1];
      let decode = ctx.app.jwt.decode(authorization);
      
      payload.ownId = decode.data._id;
    }
    if(payload.ownId!==''){
      let owncollections = await this.ctx.model.User.findOne({_id:payload.ownId}).select("collections");
      list.forEach(element=>{
        if(!!owncollections.collections.find(elem=>elem.toString() === element._id.toString())){
          element.isClicked = true;
        }
      })
    }
    return {
      total: total,
      list:list,
      current_page: page,
      page_size: pageSize,
      current_page: page,
    }
  }
}

module.exports = ArticleService;