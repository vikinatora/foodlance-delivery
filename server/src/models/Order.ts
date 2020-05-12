import { Document, Schema, Model, model } from "mongoose";

export interface IOrder extends Document {
  senderId: string,
  executorId: string,
  totalPrice: number
}

const orderSchema: Schema = new Schema({
  totalPrice: {
    type: Schema.Types.Number,
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  executorId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  },
});

const Order: Model<IOrder> = model("Order", orderSchema);

export default Order;