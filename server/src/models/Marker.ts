import { Document, Schema, Model, model } from "mongoose";

export interface IMarker extends Document {
  lat: number;
  lng: number;
  active: boolean;
  orderId: number;
}

const markerSchema: Schema = new Schema({
  lat: {
    type: Schema.Types.Number,
    required: true,
  },
  lng: {
    type: Schema.Types.Number,
    required: true,
  },
});

const Marker: Model<IMarker> = model("Marker", markerSchema);

export default Marker;