import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/orderModel.js";

// @desc Create New ORder
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("no order items");
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc GET ORder by ID
// @route POST /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

// @desc Update ORder to paid
// @route POST /api/orders/:id.pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Payment Failed");
  }
});

// @desc GET logged in user ORder
// @route POST /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc GET all ORder
// @route POST /api/orders/
// @access Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

// @desc Update ORder to Delivered
// @route POST /api/orders/:id/deliver
// @access Private/admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Set Delivered Failed");
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered,
};
