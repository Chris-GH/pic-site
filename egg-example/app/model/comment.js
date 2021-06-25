'use strict';
module.exports = app => {
  const mongoose = app.mongoose
  const Comment = new mongoose.Schema({
    writerId: { type: String, required: true },
    writerInfo: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'user',
    },
    artId: { type: String, required: true },
    commentText: { type: String, required: true },
    hotnums: {type: Number, default:0},
    isClicked:{type: Boolean, default:false},
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
  })
  return mongoose.model('comment', Comment)
}