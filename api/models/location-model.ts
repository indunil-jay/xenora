import mongoose, { Schema, Document } from "mongoose";

export interface ILocation extends Document {
  _id: Schema.Types.ObjectId;
  type: string;
  coordinates: [number, number];
  name: string;
}

const locationSchema = new Schema<ILocation>({
  type: {
    type: String,
    default: "Point",
    enum: {
      values: ["Point"],
      message: "location type value must be Point.",
    },
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function (value: number[]) {
        return value.length === 2;
      },
      message:
        "coordinates must contain exactly 2 elements (longitude and latitude).",
    },
  },
  name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "location must have a name."],
  },
});

const Location = mongoose.model<ILocation>("Location", locationSchema);

export default Location;
