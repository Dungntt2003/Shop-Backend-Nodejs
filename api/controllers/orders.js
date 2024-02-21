const Order = require("../models/order");
const mongoose = require("mongoose");
const Product = require("../models/product");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("product _id quantity")
    .populate("product")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            quantity: doc.quantity,
            product: doc.product,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Order stored",
        order: {
          _id: result._id,
          quantity: result.quantity,
          product: result.product,
        },
        request: {
          type: "POST",
          url: "http://localhost:3000/orders/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then((result) => {
      res.status(200).json({
        order: result,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_delete_order = (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      return res.json(200).json({
        message: "Order deleted successfully",
        request: {
          type: "DELETE",
        },
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
};
