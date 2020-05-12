import { Document, Schema, Model, model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  quantity: number;
  price: number;
  orderId: number;
}

const productSchema: Schema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  quantity: {
    type: Schema.Types.Number,
    required: true,
  },
  price: {
    type: Schema.Types.Number,
    required: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Orders",
    required: true,
  },
});

const Product: Model<IProduct> = model("Product", productSchema);

export default Product;