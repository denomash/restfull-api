import express from "express";
import mongoose from "mongoose";
import checkAuth from "../middleware/check-auth";

import Order from "../models/orders";
import Product from "../models/products";

const router = express.Router();

router.get("/", checkAuth, (req, res, next) => {
  Order.find()
    .select("_id product quantity")
    .populate("product", "name")
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        order: docs.map(doc => ({
          product: doc.product,
          quantity: doc.quantity,
          _id: doc._id,
          request: {
            type: "GET",
            url: `http://localhost:8080/products/${doc._id}`
          }
        }))
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", checkAuth, (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order was created ",
        orderCreated: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: `http://localhost:8080/orders/${result._id}`
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:orderId", checkAuth, (req, res, next) => {
  Order.findById({ _id: req.params.orderId })
    .populate("product")
    .exec()
    .then(order => {
      if (!order) {
        res.status(404).json({
          message: "Order not found"
        });
      }
      res.status(200).json({
        ordrer: order,
        request: {
          type: "GET",
          url: "http://localhost:8080/orders/"
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:orderId", checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

export default router;
