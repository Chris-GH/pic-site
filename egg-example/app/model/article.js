'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const ArticleSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    title: { type: String, required: true },
    pic_url: [{ type: String, required: true }],
    writing: { type: String, required: true },
    tags: [{ type: String, required: true }],
    hotnums: { type: Number, default: 0 },
    isClicked: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now() },
    updateAt: { type: Date, default: Date.now() },
  });
  return mongoose.model('article', ArticleSchema);
};
