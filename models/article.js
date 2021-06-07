const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    // validate:
    default: 'New Post'
  },
  text: String,
  published: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    // set:
  }
});

articleSchema.static({
  list: function (callback) {
    this.find({}, null, {sort: {_id: -1}}, callback)
  }
});

module.exports = mongoose.model('Article', articleSchema);