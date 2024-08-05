import mongoose, { Schema } from "mongoose";

interface ITour {
  name: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  difficulty: "medium" | "easy" | "hard";
  priceDiscount: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: Date[];
  createdAt: Date;
  updatedAt: Date;
}

const tourSchema = new Schema<ITour>(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name."],
      unique: true,
      trim: true,
      minlength: [6, "A tour name must contain at least 6 characters."],
      maxlength: [100, "A tour name must be less than 100 characters."],
      validate: {
        validator: function (val: string) {
          return /^[A-Za-z\s]+$/.test(val);
        },
        message:
          "The tour name must consist of only alphabetic characters (A-Z) and spaces.",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
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
      min: [1, "A tour group must contain at least 1 member."],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty."],
      enum: {
        values: ["medium", "easy", "hard"],
        message: "Difficulty is either easy, medium, or hard.",
      },
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (this: ITour, val: number) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below the regular price.",
      },
    },
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
  },
  { timestamps: true }
);

const Tour = mongoose.model<ITour>("Tour", tourSchema);

export default Tour;
