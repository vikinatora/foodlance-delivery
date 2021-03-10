import { Document, Model, model, Schema } from "mongoose";
import { IOrder } from "./Order";

export interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  experience: number;
  imageSrc: string;
  acceptedOrder: any;
  completedOrders: IOrder[];
  avatar: string;
}

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  tips: {
    type: Number,
    default: 0.00,
    required: true,
  },
  acceptedOrder: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: false,
  },
  experience: {
    type: Number,
    required: true,
    default: 0
  },
  avatarSrc: {
    type: String,
    required: false,
    default: ""
  },
  completedOrders: [{
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: false,
  }],
  avatar: {
    type: String,
    required: false
  },
});

const User: Model<IUser> = model("User", userSchema);

export default User;
