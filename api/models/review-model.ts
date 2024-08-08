import { model, Schema } from "mongoose";

interface IReview {
  review: string;
  rating: number;
  tourId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    review: {
      type: String,
      trim: true,
      minlength: [10, "the review must contain at least 10 characters."],
      required: [true, "the review must have a description."],
    },

    rating: {
      type: Number,
      min: [1, "lowest rating is 1.0."],
      max: [5, "maximum rating is 5.0."],
      default: 4.5,
    },
    tourId: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "review must belong to a tour"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "review must belong to a user"],
    },
  },
  { timestamps: true }
);

const Review = model<IReview>("Review", reviewSchema);

export default Review;
