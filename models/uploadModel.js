
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('uploadModel', userSchema);