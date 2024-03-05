const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  file: { type: Buffer, required: true },
});

module.exports = mongoose.model('Upload', uploadSchema);

