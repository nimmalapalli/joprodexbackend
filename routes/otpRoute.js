const express = require('express');
const twilio = require('twilio');
const router = express.Router();
const otpModel = require('../models/otpModel');

router.use(express.urlencoded({ extended: false }));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

var client = new twilio(accountSid, authToken);


const otp = Math.floor(100000 + Math.random() * 90000);

router.post('/sendotp', (req, res) => {
    client.messages.create({
        body: `Hello Nikhila, your OTP is: ${otp}`,
        to: '+919963760431',
        from: '+13174893625'
    })
    .then((message) => {
        console.log('Message sent:', message.sid);
        res.status(200).json({ status: 'success', message: 'OTP sent successfully. Check your phone for the OTP.' });
    })
    .catch((error) => {
        console.error('Error sending message:', error);
        res.status(500).json({ status: 'error', message: 'Failed to send OTP. Please try again later.' });
    });
});

router.post('/verifyotp', (req, res) => {
    try {
        const userEnteredOTP = req.body.userEnteredOTP;

        
            console.log('Valid OTP');
            res.status(200).json({ status: 'success', message: 'OTP verification successful. Access granted!' });
       
        }
    catch (error) {
        
        console.error('Error verifying OTP:', error.message);
        res.status(400).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
