const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    to: { type: String, unique: true, required: true },
    from: { type: String, unique: true, required: true }
});

module.exports = mongoose.model('otp', otpSchema);
