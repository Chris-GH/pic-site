'use strict'
module.exports = app=>{
    const mongoose = app.mongoose;
    const UserSchema = new mongoose.Schema({
        name:{type:String,required:true},
        password:{type:String,required:true},
        sign:{type:String,default:''},
        avatar:{type:String,default:''},
        follows:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            default:[]
        }],
        fans:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            default:[]
        }],
        collections:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'article',
            default:[]
        }],
        works:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'article',
            default:[]
        }],
        comments:[{
            type:mongoose.Schema.Types.ObjectId,
            default:[]
        }],
        gender:{type:String,default:'male'},
        address:{type:String,default:'阿尔巴尼亚'},
        logindate:{type:Date,default:Date.now()},
        createAt:{type:Date,default:Date.now()},
        updateAt:{type:Date,default:Date.now()},    
    });
    return mongoose.model("user",UserSchema);
}