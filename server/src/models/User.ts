import { Document, Model, model, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  acceptedOrder: any;
  experience: number;
  imageSrc: string;
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
    required: true,
    default: ""
  },
});

const User: Model<IUser> = model("User", userSchema);

export default User;
