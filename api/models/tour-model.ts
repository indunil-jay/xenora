import mongoose, { Schema, Document } from "mongoose";

interface ITour extends Document {
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
  startLocation: {
    location: Schema.Types.ObjectId;
    address: string;
  };
  locations: {
    location: Schema.Types.ObjectId;
    day: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const startLocationSchema = new Schema({
  location: {
    type: Schema.Types.ObjectId,
    ref: "Location",
    required: [true, "start location must have a location."],
  },
  address: {
    type: String,
    required: [true, "start location must have a start address."],
  },
});

const tourSchema = new Schema<ITour>(
  {
    name: {
      type: String,
      required: [true, "The tour must have a name."],
      unique: true,
      trim: true,
      minlength: [6, "The tour name must contain at least 6 characters."],
      maxlength: [100, "The tour name must be less than 100 characters."],
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
      required: [true, "The tour must have a price."],
    },
    duration: {
      type: Number,
      required: [true, "The tour must have a duration."],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "The tour must have a group size."],
      min: [1, "The tour group must contain at least 1 member."],
    },
    difficulty: {
      type: String,
      required: [true, "The tour must have a difficulty."],
      enum: {
        values: ["medium", "easy", "hard"],
        message: "Difficulty is either easy, medium, or hard.",
      },
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val: number) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below the regular price.",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "The tour must have a summary."],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "The tour must have a description."],
    },
    imageCover: {
      type: String,
      required: [true, "The tour must have a cover image."],
    },
    images: [String],
    startDates: [Date],

    startLocation: startLocationSchema,
    locations: {
      type: [
        {
          location: {
            type: Schema.Types.ObjectId,
            ref: "Location",
            required: true,
          },
          day: {
            type: Number,
            required: true,
          },
        },
      ],
      validate: {
        validator: function (
          locations: { location: Schema.Types.ObjectId; day: number }[]
        ) {
          return locations.length > 0;
        },
        message: "the tour must have at least one location.",
      },
    },
  },
  { timestamps: true }
);

const Tour = mongoose.model<ITour>("Tour", tourSchema);

export default Tour;
