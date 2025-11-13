import axios from "axios";

// Order status constants
export const ORDER_STATUS = {
  PENDING_PAYMENT: 1,
  PENDING: 2,
  PROCESSING: 3,
  DELIVERED: 4,
  COMPLETED: 5,
  CANCELLED: 6,
};

export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING_PAYMENT]: "Pending Payment",
  [ORDER_STATUS.PENDING]: "Pending",
  [ORDER_STATUS.PROCESSING]: "Processing",
  [ORDER_STATUS.DELIVERED]: "Delivered",
  [ORDER_STATUS.COMPLETED]: "Completed",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
};

// Get history orders
export const getHistoryOrders = async (page = 1, pageSize = 10, status = null) => {
  try {
    const params = {
      page,
      pageSize,
    };

    if (status !== null) {
      params.status = status;
    }

    const response = await axios.get("/api/user/order/historyOrders", { params });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch history orders:", error);
    throw error;
  }
};

// Get order details
export const getOrderDetail = async (orderId) => {
  try {
    const response = await axios.get(`/api/user/order/orderDetail/${orderId}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    await axios.put(`/api/user/order/cancel/${orderId}`);
  } catch (error) {
    console.error("Failed to cancel order:", error);
    throw error;
  }
};

// Repeat order
export const repeatOrder = async (orderId) => {
  try {
    await axios.post(`/api/user/order/repetition/${orderId}`);
  } catch (error) {
    console.error("Failed to repeat order:", error);
    throw error;
  }
};

// Send reminder for order
export const reminderOrder = async (orderId) => {
  try {
    await axios.get(`/api/user/order/reminder/${orderId}`);
  } catch (error) {
    console.error("Failed to send reminder:", error);
    throw error;
  }
};

// Submit order
export const submitOrder = async (orderData) => {
  try {
    const response = await axios.post("/api/user/order/submit", orderData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to submit order:", error);
    throw error;
  }
};

// Order payment
export const paymentOrder = async (paymentData) => {
  try {
    const response = await axios.post("/api/user/order/payment", paymentData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to process order payment:", error);
    throw error;
  }
};