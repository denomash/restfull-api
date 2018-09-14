import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
