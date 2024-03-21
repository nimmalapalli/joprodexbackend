const express = require('express');
const router = express.Router();
const User = require('../models/user');


const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            const error = new Error('We could not find the user with the given email');
            error.status = 404;
            throw error;
        }

        const resetToken = user.createResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: 'Password reset token sent to your email',
        });
    } catch (error) {
        next(error);
    }
};


const resetPassword = async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            const error = new Error('Reset token and new password are required');
            error.status = 400;
            throw error;
        }

        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() }, 
        });

        if (!user) {
            const error = new Error('Invalid or expired reset token');
            error.status = 400;
            throw error;
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
       forgotPassword,
       resetPassword,
        
    };
