const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const modelName = 'User';

if (mongoose.modelNames().includes(modelName)) {
    module.exports = mongoose.model(modelName);
} else {
    const userSchema = new Schema({
        name: { type: String, unique: true },
        email: { type: String, unique: true },
        mobile: { type: Number, unique: true },
        password: { type: String, required: true },
        companyname: { type: String, unique: true },

        // confirmPassword: {
        //     type: String,
        //     required: [true, 'Please confirm your password.'],
        //     validate: {
        //         validator: function (val) {
        //             return val === this.password;
        //         },
        //         message: 'Password & Confirm Password do not match!',
        //     },
        // },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetTokenExpires: Date,
    });

    userSchema.pre('save', async function (next) {
        if (!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmPassword = undefined;
        next();
    } catch (err) {
        return next(err);
    }
    });

    userSchema.methods.comparePasswordInDb = async function (pswd, pswdDB) {
        
        try {
            return await bcrypt.compare(pswd, pswdDB);
        } catch (err) {
            return false; 
        }
    };

    userSchema.methods.isPasswordChanged = async function (JWTTimestamp) {
        if (this.passwordChangedAt) {
            const pswdChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
            return await JWTTimestamp < pswdChangedTimestamp;
        }
        return false;
    };
    
    userSchema.methods.createResetPasswordToken =async function () {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
        return await resetToken;
    };
    


    const User = mongoose.model('User', userSchema);
    module.exports = User;
}










