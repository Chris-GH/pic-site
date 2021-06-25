'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/home/getBanner', controller.home.banner);
  router.get('/home/freshBanner', controller.home.freshbanner);

  router.post('/user/login',controller.user.login);
  router.post('/user/create', controller.user.create);
  router.post('/user/getCollections', controller.user.getCollections);
  router.post('/user/getFans', controller.user.getFans);
  router.post('/user/getFollows', controller.user.getFollows);
  router.post('/user/getWorks', controller.user.getWorks);

  router.post('/upload', controller.home.uploadstream);
  router.post('/uploadfiles', controller.home.uploadfiles);

  router.get('/article/tags',controller.article.gettags);
  router.get('/article/query',controller.article.query);
  router.get('/article/getComments',controller.article.comment);
  router.get('/article/getRanks',controller.article.getranks);
  router.get('/article/getArtByhot',controller.article.querybyhot);


  const token = app.middleware.token();
  
  router.post('/user/info', token, controller.user.info);
  router.post('/user/login_out', token, controller.user.login_out);
  router.post('/user/edit', token, controller.user.edit);
  router.post('/user/toggleCollection', token, controller.user.toggleCollection);
  router.post('/user/toggleFollow', token, controller.user.toggleFollow);
  router.post('/user/toggleComment', token, controller.user.toggleComment);

  router.post('/article/publish', token, controller.article.publish);
  router.post('/article/postComment',token,controller.article.comment);

  
};
