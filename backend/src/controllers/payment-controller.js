const PaymentService = require('../services/payment-service');
const { StatusCodes } = require('http-status-codes');

const paymentService = new PaymentService();

const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Amount is required'
            });
        }
        const order = await paymentService.createOrder(amount);
        return res.status(StatusCodes.CREATED).json({
            success: true,
            data: order
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR || 500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, clerkId } = req.body;
        
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !clerkId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'All payment details and clerkId are required'
            });
        }

        const response = await paymentService.verifyPayment(
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature, 
            clerkId
        );

        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR || 500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment
};
