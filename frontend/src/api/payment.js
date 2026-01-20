import api from './axios';

export const createOrder = async (amount) => {
    const response = await api.post('/payment/create-order', { amount });
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await api.post('/payment/verify-payment', paymentData);
    return response.data;
};
