const express = require('express');
const payment_route = express();


const bodyParser = require('body-parser');
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended:false }));

const path = require('path');
payment_route.set('view engine','ejs');
payment_route.set('views',path.join(__dirname, '../views'));

const Paymentcontroller = require('../middleware/PaymentController');

payment_route.post('/createOrder', Paymentcontroller.createOrder);
payment_route.post('/verifyOrder', Paymentcontroller.verifyOrder);

module.exports = payment_route;

