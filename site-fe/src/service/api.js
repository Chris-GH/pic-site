import axios from 'axios';

class HttpRequest{
  constructor(opts){
    this.default = {
      baseUrl:''
    }
    this.default = Object.assign(this.default,opts);
  }

  request(options){//当你创建http时，会自动调用拦截器添加方法，用的是实例添加的方式，给当前实例添加拦截器。
    options = Object.assign(this.default,options);
    const instance = axios.create(options);
    this.interceptors(instance);
    return instance;
  }

  interceptors(instance){
    instance.interceptors.request.use(
      config=>{
        let token = localStorage.getItem("token");
        if(token){
          config.headers.authorization = `token ${token}`;//前端制作的头部格式，中间的空格方便后端取取token
        }
        return config;
      },
      err=>{
        return Promise.reject(err);
      }
    );

    instance.interceptors.response.use(
      res=>{
        const {data} = res;//解析出数据
        return data;
      },
      err=>{
        return Promise.reject(err);
      }
    );
  }
}

const request = new HttpRequest({
  baseURL: '/api'
});

const http = request.request();


/**
 * 账号登录
 * @export
 * @param {Object} params - 
 * @param {string} params.name - 用户名
 * @param {string} params.password - 密码
 * @returns
 */
 export async function login(params){
  return await http.post('/user/login', params);
}

/**
 * 注册账号
 * @export
 * @param {Object} params - 
 * @param {Object} params.name - 用户名
 * @param {Object} params.password - 密码
 * @returns
 */
 export async function register(params){
  return await http.post('/user/create', params);
}

/**
 * 获取用户信息
 * @export
 * @param {Object} params - 
 * @param {string} [params.userId] - 用户id
 * @returns
 */
 export async function userInfo(params){
  return await http.post('/user/info', params);
}

/**
 * 账号登出
 */
 export async function login_out(){
  return await http.post('/user/login_out');
}

/**
 * 发布文章
 * @export
 * @param {Object} params - 需要上传的数据，如下
 * title: { type: String},
 * pic_url: [{ type: String}],
 * writing:{ type: String},
 * tags: [{type: String}],
 * collectionUsers:[{type: mongoose.Schema.Types.ObjectId, }], 
 * @returns
 */
 export async function publish(params){
  return await http.post('/article/publish', params);
}

/**
 * 获取分类标签
 */
export async function getTags(){
  return await http.get('/article/tags');
}

/**
 * 获取分类标签
 */
 export async function getRanks(){
  return await http.get('/article/getRanks');
}

/**
 * 拿到用户发布的作品，可做筛使用选
 * @export
 * @param {Object} [params] - 不填写，则获取所有的作品
 * @param {string} [params.userId] - 指定用户的作品
 * @param {string} [params.artId] - 指定用户的作品
 * @param {string} [params.property.people] - 按人气筛选
 * @param {string} [params.page] - 指定页码
 * @returns
 */
 export async function getArticles(params){
  return await http.get('/article/query',{params:params});
}

export async function getArtByhot(params){
  return await http.get('/article/getArtByhot',{params:params});
}

/**
 * 获取首页数据
 */
 export async function getBanner(){
  return await http.get('/home/getBanner');
}

/**
 * 获取首页数据
 */
 export async function freshBanner(params){
  return await http.get('/home/freshBanner',{params:params});
}

/**
 * 修改用户信息
 */
 export async function userEdit(params){
  return await http.post('/user/edit',params);
}

/**
 * 点赞
 */
 export async function toggleCollection(params){
  return await http.post('/user/toggleCollection',params);
}

/**
 * 评论区点赞
 */
 export async function toggleComment(params){
  return await http.post('/user/toggleComment',params);
}

/**
 * 关注
 */
 export async function toggleFollow(params){
  return await http.post('/user/toggleFollow',params);
}

/**
 * 获取收藏
 */
 export async function getCollections(params){
  return await http.post('/user/getCollections',params);
}

/**
 * 获取粉丝
 */
 export async function getFans(params){
  return await http.post('/user/getFans',params);
}

/**
 * 获取关注
 */
 export async function getFollows(params){
  return await http.post('/user/getFollows',params);
}

/**
 * 获取作品
 */
 export async function getWorks(params){
  return await http.post('/user/getWorks',params);
}

/**
 * 提交评论
 */
 export async function postComment(params){
  return await http.post('/article/postComment',params);
}

/**
 * 获取评论
 */
 export async function getComments(params){
  return await http.get('/article/getComments',{params:params});//get请求一定要加params的标记
}