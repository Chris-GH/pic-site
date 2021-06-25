'use strict';
module.exports = app => {
  const mongoose = app.mongoose
  const Tags = new mongoose.Schema({
    name: { type: String, required: true },
  })
  return mongoose.model('tags', Tags)
}