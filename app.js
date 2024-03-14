const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const twilio =require('twilio')
const app = express();
const ejs = require("ejs");
require("dotenv").config();
const cors = require('cors')
const authRoute = require('./routes/auth.route');
const router = require('./routes/router');
const shipmentRoute = require('./routes/shipmentRoute');
const paymentRoute = require('./routes/paymentRoute');
const appRoute = require('./routes/route');
const appController = require('./mailer/controller/appController');
const pincodeRoute = require('./routes/pincodeRoute.js');
const uploadRoute = require('./routes/uploadRoute.js');
const otpRoute = require('./routes/otpRoute.js');


const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

const port = process.env.PORT || 8080;

// app.use(function (req, res, next) {
  // res.header('Access-Control-Allow-Origin',"*");
  // res.header('Access-Control-Allow-Headers', true);
  // res.header('Access-Control-Allow-Credentials', true);
  // res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // next();
// });
// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/data', );
// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error',{ useNewUrlParser: true, useUnifiedTopology: true }));
// db.once('open', () => {
//     console.log('Connected to MongoDB');
// });
const uri='mongodb+srv://nikhilareddygandlapati:fO8kXWN8aMJKyIyf@cluster0.emcygxj.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri, {   
  useNewUrlParser: true,
  useUnifiedTopology: true,

  
  });
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('Error connecting to MongoDB Atlas with Mongoose:', error);
});
db.once('open', () => {
  console.log('Connected to MongoDB Atlas with Mongoose');
});

app.use(express.json({extended: false}));
app.use(express.urlencoded({ extended: true })) 
app.use(cors());
app.use('/api', authRoute);
app.use('/api', router);
app.use('/api', shipmentRoute);
app.use('/api', paymentRoute);
app.use('/api', appRoute);
app.use('/api', otpRoute)
app.use('/api', pincodeRoute);
app.use('/api', uploadRoute);
 
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(fileUpload({ createParentPath: true }));
router.use(fileUpload());


app.get('/', (req, res) => {
    res.send('welcome to snv');
});

const userSchema = new Schema({
  name: { type: String, unique: true },
  email: { type: String, unique: true },
  mobile: { type: Number, unique: true },
  password: { type: String, required: true },
  companyname: { type: String, unique: true },
  cruds: [{ type: Schema.Types.ObjectId, ref: 'Crud' }],
  shipments: [{ type: Schema.Types.ObjectId, ref: 'Shipment' }],
  paymentcontrollers: [{ type: Schema.Types.ObjectId, ref: 'PaymentController' }],
  uploads: [{ type: Schema.Types.ObjectId, ref: 'Upload' }], 
});

const Users = mongoose.model('Users', userSchema);


const crudSchema = new Schema({
  order: { type: String, unique: true },
  date: { type: String, unique: true },
  payment: { type: Number, unique: true },
  product: { type: String, required: true },
  customer: { type: String, required: true },
  phone: { type: Number, unique: true },
  weight: { type: String, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  shipments: [{ type: Schema.Types.ObjectId, ref: 'Shipment' }],
});

const Crud = mongoose.model('Crud', crudSchema);


const shipmentSchema = new Schema({
  order_Id: { type: Number, unique: true },
  customer_Name: { type: String, unique: true },
  customer_Address: { type: String, unique: true },
  billing_Num: { type: Number, required: true },
  pickup_loc: { type: String, required: true },
  pin_Code: { type: Number, unique: true },
  shipping_Date: { type: String, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  crud: { type: Schema.Types.ObjectId, ref: 'Crud' },
});

const Shipment = mongoose.model('Shipment', shipmentSchema);


const paymentControllerSchema = new Schema({
  name: { type: String, unique: true },
  amount: { type: Number, unique: true },
  product_name: { type: String, unique: true },
  description: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  crud: { type: Schema.Types.ObjectId, ref: 'Crud' },
  shipment: { type: Schema.Types.ObjectId, ref: 'Shipment' },
});

const PaymentController = mongoose.model('PaymentController', paymentControllerSchema);

let Upload;

try {
  Upload = mongoose.model('Upload');
} catch (error) {
  
  const uploadSchema = new Schema({
    file: { type: Buffer, required: true },
  });

  Upload = mongoose.model('Upload', uploadSchema);
}

app.get('/created', async (req, res) => {
  let newUser; 
  try {
    const existingUser = await Users.findOne({ companyname: 'snvsolutions' });

    if (existingUser) {
      existingUser.name = 'newName';
      await existingUser.save();
    } else {
      newUser = await Users.create({
        name: 'deepika11',
        email: 'deepu1@gmail.com',
        mobile: 98991987679,
        password: 'deepu',
        companyname: 'snvsoluwtions',
      });
    }

    const newUpload = await Upload.create({
      file: 'c:\\Users\\GandlapatiNikhilaRed\\Downloads\\myy adhaar.jpg'
    });
    
    if (newUser) {
      newUser.uploads.push(newUpload);
      await newUser.save();

      const newCrud = await Crud.create({
        order: 'lemons',
        date: '26/08/2028',
        payment: 78901,
        product: 'itemss',
        customer: 'revathii',
        phone: 8887678879,
        weight: '7.6',
        user: newUser,
      });

      const newShipment = await Shipment.create({
        order_Id: 456765,
        customer_Name: 'swethaa',
        customer_Address: 'nizampeta',
        billing_Num: '876678',
        pickup_loc: 'ananatapura',
        pin_Code: 515401,
        shipping_Date: '18/09/2022',
        user: newUser._id,
        crud: newCrud,
      });

      const newPaymentController = await PaymentController.create({
        name: 'nikhilaa',
        amount: 100,
        product_name: 'ironbox',
        description: 'dfgd',
        user: newUser,
        crud: newCrud,
        shipment: newShipment,
      });

      newUser.paymentcontrollers.push(newPaymentController);
  await newUser.save();
}

    res.send('Users, Crud, Shipment, and PaymentController created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message, message: 'Internal Server Error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .populate({
        path: 'cruds',
        model: 'Crud',
        select: 'order date payment product customer phone weight',
      })
      .populate({
        path: 'shipments',
        model: 'Shipment',
        select: 'customer_Name customer_Name customer_Address billing_Num pickup_loc pin_Code shipping_Date',
      })
      .populate({
        path: 'paymentcontrollers',
        model: 'PaymentController',
        select: 'name amount product_name description',
      })
      .populate({
        path: 'uploads',  
        model: 'Upload',   
        select: 'file',
      });
      
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})