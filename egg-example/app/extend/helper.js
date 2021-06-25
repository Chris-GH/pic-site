const moment = require('moment');
const cloneDeepWith = require('lodash/cloneDeepWith');
var path = require('path');
var fs = require('fs');
var sizeOf = require('image-size');
let Duplex = require('stream').Duplex;

//exports.relativeTime = time => moment(new Date(time * 1000)).fromNow();

// 删除 value 值为undefined或者null的字段
exports.filterDef = function(obj){
    let cloneObj = {...obj};
    for(let key in cloneObj){
      if(cloneObj.hasOwnProperty(key)){
        if(typeof cloneObj[key] === 'undefined' || cloneObj[key] === null){
          delete cloneObj[key];
        }
      }
    }
    return cloneObj;
}

exports.sleep = function(t){
  return new Promise((r) => setTimeout(r, t));
}

exports.cloneDeepWith = function(object){
  return cloneDeepWith(object);
}

exports.writeStreamToDisk = async function(stream, options) {
  let defaults = {
    path: path.join(process.cwd(), './app/public'),  // 默认路径
    filename: '',
    width: Infinity,
    height: Infinity,
    size: Infinity,
    just: false//判断是否合并过
  }
  Object.assign(defaults, options);
  const {width, height, size, just} = defaults;
  const streamInfo = await getStreamInfo(stream);
  
  if(just && (streamInfo.width > width || streamInfo.height > height)){//合并了但是尺寸有超出边界的
    return {
      error: 1,
      mes: '尺寸有超出边界 210*210'
    }
  }
  if(!just && (streamInfo.width > width || streamInfo.height > height)) {
    return {
      error: 1,
      mes: '文件尺寸不符合要求2'
    }
  }
  if(streamInfo.size > size) {
    return {
      error: 1,
      mes: '文件大小不符合要求'
    }
  }
  const parse = path.parse(stream.filename);
  const filename = parse.name + Date.now() + parse.ext;
  
  const fileStream = bufferToStream(streamInfo.fileBuffer);
  const target = path.join(this.config.multipart.tmpdir,defaults.path, filename);
  const writeStream = fs.createWriteStream(target);
  fileStream.pipe(writeStream);
  //console.log("执行文件写入",target);
  return {
    success: 0,
    filename: filename,
    uploadPath: options.path,
    accessPath:  path.join(this.config.static.prefix, options.path, filename),
    mes: '文件上传成功'
  }
}

const getStreamInfo = async function(stream) {
  const fileBuffer = await streamToBuffer(stream);
  return {
    ...sizeOf(fileBuffer),
    fileBuffer,
    size: fileBuffer.length
  }
}
exports.getStreamInfo = getStreamInfo;

const streamToBuffer = function(stream) {
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data));//每一个data都是一个buffer缓冲
    stream.on('end', () => resolve(Buffer.concat(buffers)));//concat参数，传入buffer型的数组，返回一个buffer
  });
}
exports.streamToBuffer = streamToBuffer;

const bufferToStream = function (buffer) {  
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
exports.bufferToStream = bufferToStream;