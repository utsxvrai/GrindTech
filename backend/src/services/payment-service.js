const Razorpay = require('razorpay');
const crypto = require('crypto');
const UserRepository = require('../repositories/user-repository');

const userRepository = new UserRepository();

class PaymentService {
    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }

    async createOrder(amount, currency = 'INR') {
        try {
            const options = {
                amount: amount * 100, // amount in the smallest currency unit
                currency,
                receipt: `receipt_${Date.now()}`,
            };
            const order = await this.razorpay.orders.create(options);
            return order;
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            throw error;
        }
    }

    async verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature, clerkId) {
        try {
            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSign = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(sign.toString())
                .digest("hex");

            if (razorpay_signature === expectedSign) {
                // Payment verified, update user plan
                await userRepository.updatePlan(clerkId, 'pro');
                return { success: true, message: "Payment verified successfully" };
            } else {
                throw new Error("Invalid signature sent!");
            }
        } catch (error) {
            console.error('Error verifying Razorpay payment:', error);
            throw error;
        }
    }
}

module.exports = PaymentService;
