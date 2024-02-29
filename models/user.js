const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name:{type:String,unique:true},
    email:{type:String,unique:true},
    mobile:{type:Number,unique:true},
    password:{type:String,required:true},
    companyname:{type:String,unique:true},
});

module.exports = mongoose.model('user',userSchema);
