import { Query } from "mongoose";

class QueryHandler<T> {
  public query: Query<T[], T>;
  public queryString: Record<string, any>;

  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;
  resultsPerPage: number = 1;

  constructor(query: Query<T[], T>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  async filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    this.totalResults = await this.query.model.countDocuments(
      JSON.parse(queryStr)
    );
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = (this.queryString.sort as string).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = (this.queryString.fields as string).split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-createdAt -updatedAt -__v");
    }

    return this;
  }

  paginate() {
    const page = (this.queryString.page && Number(this.queryString.page)) || 1;
    const limit =
      (this.queryString.limit && Number(this.queryString.limit)) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    this.currentPage = page;
    this.resultsPerPage = limit;
    this.totalPages = Math.ceil(this.totalResults / this.resultsPerPage);

    if (skip >= this.totalResults) {
      throw new Error("This page does not exist");
    }

    return this;
  }
}

export default QueryHandler;
