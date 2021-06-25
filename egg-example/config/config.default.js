/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_123456s-site';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://127.0.0.1:7001', 'http://192.168.43.12:8080' ],
  };

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/s-site',
    options: {
      server: { poolSize: 20 },
      reconnectTries: 10,
      reconnectInterval: 500,
    },
  };

  config.validatePlus = {
    resolveError(ctx, errors) {
      if (errors.length) {
        ctx.type = 'json';
        ctx.status = 400;
        ctx.body = {
          code: 400,
          error: errors,
          message: '参数错误',
        };
      }
    },
  };

  config.bcrypt = {
    saltRounds: 10, // default 10
  };

  config.jwt = {
    secret: 'ssite123', // jwt的签名密钥
    enable: true, // default is false
    match: '/s-site', // optional
  };

  config.multipart = {
    mode: 'stream',
    tmpdir: path.join(process.cwd(), './app/public'),
    fileSize: '50mb',
    whitelist: [
      '.png',
      '.jpg',
      '.gif',
      '.mp4',
      '.zip',
    ],
  };

  config.static = {
    prefix: '/static',
    dir: path.join(appInfo.baseDir, 'app/public/'), // 使用http://127.0.0.1:7001/static/upload/img/1.jpg,会被转化成http://127.0.0.1:7001/app/public/upload/img/1.jpg
    dynamic: true, // 如果当前访问的静态资源没有缓存，则缓存静态文件，和`preload`配合使用；
    preload: false,
    maxAge: 31536000, // in prod env, 0 in other envs
    buffer: true, // in prod env, false in other envs
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
