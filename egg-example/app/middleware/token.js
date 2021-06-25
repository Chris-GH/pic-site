module.exports = ()=>{
    return async (ctx,next)=>{
        //console.log("欢迎来到后端token");
        let authorization = ctx.request.header.authorization;
        if(!authorization){
            ctx.body = {
                code:1,
                data:{},
                error:400,
                mes:'没有权限请求'
            }
            return ;
        }
        authorization = authorization.split(' ')[1];

        try{//为什么不使用回调？？？？
            let data = await ctx.app.jwt.verity(authorization,ctx.app.config.jwt.secret);//使用密钥进行验证token
        }catch(err){
            if(err.name === 'TokenExpireError'){
                ctx.app.jwt.decode(authorization,async function(err,data){
                    if(err){
                        await service.actionToken.deleteToken({userId:data.data._id});
                    }
                });
                ctx.body = {
                    code:1,
                    data:{},
                    error:400,
                    mes:'登录过期，请重新登录'
                }
                return;
            }
        }

        let decode = ctx.app.jwt.decode(authorization);//token有效就应该能被解析出来
        if(!decode){//不应该删除这个token吗，能通过验证说明token没问题，解析不出来的情况非常少见
            ctx.body = {
                code:1,
                data:{},
                error:400,
                mes:'token不合法,请检查后重试'
            }
            return ;
        }
        await next();
    }
}