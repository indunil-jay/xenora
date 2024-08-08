import mongoose, { model, Query, Schema, Document, Model } from "mongoose";
import Tour from "./tour-model";

interface IReview extends Document {
  review: string;
  rating: number;
  tour: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface IReviewModel extends Model<IReview> {
  calcAverageRatings(tourId: Schema.Types.ObjectId): Promise<void>;
}

const reviewSchema = new Schema<IReview, IReviewModel>(
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
  this.populate({ path: "user", select: "name photo" });
  // .populate({
  //   path: "tour",
  //   select: "name",
  // });
  next();
});

//calculate ratingsAverage and ratingsQuantity

reviewSchema.statics.calcAverageRatings = async function (
  tourId: Schema.Types.ObjectId
) {
  const ratingStats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        numberOfRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (ratingStats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: ratingStats[0].avgRating,
      ratingsQuantity: ratingStats[0].numberOfRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

//this will work .save(), .create() operation
reviewSchema.post("save", async function () {
  await (this.constructor as IReviewModel).calcAverageRatings(this.tour);
});

//handle update and delete

// Pre hook to find the document before updating or deleting
reviewSchema.pre(/^findOneAnd/, async function (this: any, next) {
  this.doc = await this.model.findOne(this.getQuery());
  next();
});

// Post hook to calculate ratings after updating or deleting a review
reviewSchema.post(/^findOneAnd/, async function (this: any) {
  if (this.doc) {
    await (this.doc.constructor as IReviewModel).calcAverageRatings(
      this.doc.tour
    );
  }
});

const Review = model<IReview, IReviewModel>("Review", reviewSchema);

export default Review;
