const Service = require('egg').Service
class UserService extends Service {
  constructor(ctx){
      super(ctx);
  }

  async findUser(payload, options={}){
      if('userId' in payload){  // _id 和userId 都可以搜索
        payload._id = payload.userId;
        delete payload.userId;
      }
      return await this.ctx.model.User.findOne(payload, options);
      
  }

  async create(payload){
      const { ctx } = this;
      payload.password = await ctx.genHash(payload.password);
      payload.avatar = '';
      return await ctx.model.User.create(payload);
  }

  async findUserInfo(payload){
      let findUser = await this.ctx.model.User.findOne(payload);
      //let menus = await this.ctx.service.menu.query({userId:payload._id});
      if(!findUser)return findUser;
      return {
        name: findUser.name,
        _id: findUser._id,
        collections:findUser.collections,
        avatar: findUser.avatar,
        sign: findUser.sign,
        follows:findUser.follows,
        fans:findUser.fans,
        gender:findUser.gender,
        address:findUser.address,
        createdAt: findUser.createdAt,
      }
  }

  async changeUserInfo(payload){
    return this.ctx.model.User.findByIdAndUpdate(payload._id, {...payload},{new:false})
  }

  /**
   *收藏或取消收藏
   * @param {*} payload
   * @returns {Boolean} true 收藏 false，取消
   * @memberof UserService
   */
   async toggleCollection(payload){
    let user = await this.ctx.model.User
                        .findOne({_id: payload.userId})
                        .populate({
                          path: 'collections',  // 点赞收藏的
                          select: '_id'
                        });
    let article = await this.ctx.model.Article
                .findOne({_id: payload.artId}).select('hotnums');
                
    let isAdd = false;
    // 关注 - 取关
    if(!!user.collections.find(item => item._id.toString() === payload.artId)){//双重否定，find若返回非undefined都会成true
      // 取消关注
      user.collections = user.collections.filter(item => item._id.toString() !== payload.artId);
      // 删掉粉丝
      article.hotnums--;
      //collectionUsers.collectionUsers = collectionUsers.collectionUsers.filter(item => item._id.toString() !== payload.userId);
      isAdd = false;
    }else {
      // 关注
      user.collections.push(payload.artId);
      // 添加粉丝
      article.hotnums++;
      isAdd = true;
    }
    await user.save();
    await article.save();
    return {
      isAdd,
      hotnums: article.hotnums
    };
  }

  /**
   *点赞评论或取消
   * @param {*} payload
   * @returns {Boolean} true 点赞 false，取消
   * @memberof UserService
   */
   async toggleComment(payload){
    let user = await this.ctx.model.User
                        .findOne({_id: payload.userId})
                        .select("comments");
    let comment = await this.ctx.model.Comment
                .findOne({_id: payload.commentId}).select('hotnums');
                
    let isAdd = false;
    // 关注 - 取关
    if(!!user.comments.find(item => item._id.toString() === payload.commentId)){//双重否定，find若返回非undefined都会成true
      // 取消关注
      user.comments = user.comments.filter(item => item._id.toString() !== payload.commentId);
      // 删掉粉丝
      comment.hotnums--;
      //collectionUsers.collectionUsers = collectionUsers.collectionUsers.filter(item => item._id.toString() !== payload.userId);
      isAdd = false;
    }else {
      // 关注
      user.comments.push(payload.commentId);
      // 添加粉丝
      comment.hotnums++;
      isAdd = true;
    }
    await user.save();
    await comment.save();
    return {
      isAdd,
      hotnums: comment.hotnums
    };
  }

  /**
   *关注或取消关注
   * @param {*} payload
   * @returns {Boolean} true 关注 false 取消
   * @memberof UserService
   */
   async toggleFollow(payload){
    let user = await this.ctx.model.User.findOne({_id: payload.userId}).select("follows");
    let fan = await this.ctx.model.User.findOne({_id: payload.authorId}).select("fans");
                
    let isFollow = false;
    // 关注 - 取关
    if(!!user.follows.find(item => item._id.toString() === payload.authorId)){//双重否定，find若返回非undefined都会成true
      // 取消关注
      user.follows = user.follows.filter(item => item._id.toString() !== payload.authorId);
      // 删掉粉丝
      fan.fans = fan.fans.filter(item => item._id.toString() !== payload.userId);
      //collectionUsers.collectionUsers = collectionUsers.collectionUsers.filter(item => item._id.toString() !== payload.userId);
      isFollow = false;
    }else {
      // 关注
      user.follows.push(payload.authorId);
      // 添加粉丝
      fan.fans.push(payload.userId);
      isFollow = true;
    }
    await user.save();
    await fan.save();
    return {
      isFollow
    };
  }

  async getCollections(payload){
    let collections = await this.ctx.model.User
        .findOne({_id: payload.userId}, {collections: 1})
        .populate({
          path: 'collections',
          // select: 'name _id sign'
        });
    return collections.collections;
  }

  async getWorks(payload){
    let works = await this.ctx.model.User
        .findOne({_id: payload.userId}, {works: 1})
        .populate({
          path: 'works',
        });
      
    return works.works;
  }

  async getFans(payload){
    let fans = await this.ctx.model.User
        .findOne({_id: payload.userId}, {fans: 1})
        .populate({
          path: 'fans',
          select: 'name avatar -_id sign'
        });
    return fans.fans;
  }

  async getFollows(payload){
    let follows = await this.ctx.model.User
        .findOne({_id: payload.userId}, {follows: 1})
        .populate({
          path: 'follows',
          select: 'name avatar sign'
        });
    return follows.follows;
  }
}
module.exports = UserService;