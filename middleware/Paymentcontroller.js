const Razorpay = require('razorpay');
const crypto = require('crypto');

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

const renderProductPage = async(req,res)=>{

    try {
        
        res.render('product');

    } catch (error) {
        console.log(error.message);
    }

}

const createOrder = async(req,res)=>{
    try {
        const amount = req.body.amount*100
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        }

        razorpayInstance.orders.create(options, 
            (err, order)=>{
                if(!err){
                    res.status(200).send({
                        success:true,
                        msg:'Order Created',
                        order_id:order.id,
                        amount:amount,
                        key_id:RAZORPAY_ID_KEY,
                        product_name:req.body.name,
                        description:req.body.description,
                        contact:"",
                        name: "",
                        email: ""
                    });
                }
                else{
                    res.status(400).send({success:false,msg:'Something went wrong!'});
                }
            }
        );

    } catch (error) {
        console.log(error.message);
    }
}
const verifyOrder = async (req, res) => {
    try {
        const { order_id, payment_id } = req.body;
        const razorpay_signature = req.headers['x-razorpay-signature'];
        const key_secret = 'avx5L9pXCMRhxBAkLDSAl8Xu';
 
      
        let hmac = crypto.createHmac('sha256', key_secret);
 
        
        hmac.update(order_id + "|" + payment_id);
 
        
        const generated_signature = hmac.digest('hex');
 
        
        console.log('razorpay_signature:', razorpay_signature);
        console.log('generated_signature:', generated_signature);
 
  
        if (razorpay_signature === generated_signature) {
            
            res.json({ success: true, message: "Payment has been verified" });
        } else {
       
            res.json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


module.exports = {
    renderProductPage,
    createOrder,
    verifyOrder
}

