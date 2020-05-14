import { Document, Schema, Model, model } from "mongoose";

export interface IOrder extends Document {
  sender: any,
  executor: any,
  totalPrice: number,
  tipPercentage: number,
  tip: number,
  products: any[],
  marker: any,
}

const orderSchema: Schema = new Schema({
  totalPrice: {
    type: Schema.Types.Number,
    required: true,
  },
  tip: {
    type: Schema.Types.Number,
    required: true,
  },
  tipPercentage: {
    type: Schema.Types.Number,
    required: true,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  }],
  marker: {
    type: Schema.Types.ObjectId,
    ref: "Marker",
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  executor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  active: {
    type: Schema.Types.Boolean,
    required: true,
    default: true
  },
});

const Order: Model<IOrder> = model("Order", orderSchema);

export default Order;