const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const resetPassword = require('../middleware/authController'); 

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: hashedPassword,
            companyname: req.body.companyname,
            
        });

        await user.save();
        res.json({ success: true, message: 'ACCOUNT CREATED SUCCESSFULLY' });
    } catch (err) {
        if (err.code === 11000) {
            return res.json({ success: false, message: 'Email Already Exists' });
        }
        console.error(err);
        res.json({ success: false, message: 'Authentication failed' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            console.log('User not found');
            return res.json({ success: false, message: 'User not found' });
        }

        
        console.log('Login successful');
        const payload = {
            userId: user._id
        };

        const token = jwt.sign(payload, "webBatch", { expiresIn: '1h' }); 

        return res.json({ success: true, token: token, message: 'Login successfully' });
    } catch (err) {
        console.error('Authentication failed:', err);
        res.json({ success: false, message: 'Authentication failed' });
    }
});

router.get('/profile', checkAuth, (req, res) => {
    const userId = req.userData.userId;
    User.findById(userId)
        .exec()
        .then((result) => {
            
            res.json({ success: true, data: result });
        })
        .catch((err) => {
            
            res.status(500).json({ success: false, message: "server error" });
        });
});


router.get('/success', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users, message: 'Authentication login successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});




// router.get("/api/getByuserid",(req,res)=>{
//     const userId = req.params.userId;
//     User.findOne(userId,(err,data)=>{
//         if (err){
//             console.log(err);
//         }
//         else{
//             res.send(data)
//         }
//     })

// })
router.post('/forgotpassword', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            console.error('User not found for email:', req.body.email);
            return res.status(404).json({
                success: false,
                message: 'We could not find the user with the given email',
            });
        }

        const resetToken = user.createResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        console.log('Reset token generated and saved:', resetToken);

        res.status(200).json({
            success: true,
            message: 'Password reset token sent to your email',
        });
    } catch (err) {
        console.error('Error in forgotPassword:', err);
        next(err);
    }
});


router.post('/resetPassword', async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;
        const user = await User.findOne({ resetToken });

        
        // user.password = newPassword;
        // await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully.',
        });
    } catch (err) {
        console.error('Error in resetPassword:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Password reset failed.',
        });
    }
});

  
  module.exports = {
    resetPassword,
  };
  

module.exports = router;

