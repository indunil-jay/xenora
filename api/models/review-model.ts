import { model, Query, Schema, Document } from "mongoose";

interface IReview {
  review: string;
  rating: number;
  tour: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
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
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "review must belong to a tour"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "review must belong to a user"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre<Query<any, Document<IReview>>>(/^find/, async function (next) {
  this.populate({ path: "user", select: "name photo" }).populate({
    path: "tour",
    select: "name",
  });
  next();
});

const Review = model<IReview>("Review", reviewSchema);

export default Review;
