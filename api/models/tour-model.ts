import mongoose from "mongoose";

interface ITour {
  name: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  difficulty: "medium" | "easy" | "hard";
  priceDiscount: Number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: [Date];
  // need to add below two becuase of  {timestamps: true}
  createdAt: Date;
  updatedAt: Date;
}

const tourSchema = new mongoose.Schema<ITour>(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name."],
      unique: true,
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "A tour must have a price."],
    },

    duration: {
      type: Number,
      required: [true, "A tour must have a duration."],
    },

    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size."],
    },

    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty."],
    },

    priceDiscount: Number,

    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary."],
    },

    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description."],
    },

    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image."],
    },

    images: [String],

    startDates: [Date],

    //TODO: locations details
  },

  { timestamps: true }
);

const Tour = mongoose.model<ITour>("Tour", tourSchema);

export default Tour;
