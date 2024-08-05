import { Query } from "mongoose";

/**
 * Class to handle query operations including filtering, sorting, field limiting, and pagination.
 * @template T - The type of the documents being queried.
 */
class QueryHandler<T> {
  public query: Query<T[], T>;
  public queryString: Record<string, any>;
  public currentPage: number = 1;
  public totalPages: number = 1;
  public totalResults: number = 0;
  public resultsPerPage: number = 10; // Default to 10

  /**
   * Creates an instance of QueryHandler.
   * @param {Query<T[], T>} query - The Mongoose query object.
   * @param {Record<string, any>} queryString - The query parameters from the request.
   */
  constructor(query: Query<T[], T>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Applies filtering to the query based on the query string.
   * @returns {Promise<QueryHandler<T>>} The current instance of the QueryHandler.
   */
  async filter(): Promise<QueryHandler<T>> {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    // Count total results before pagination
    this.totalResults = await this.query.model.countDocuments(
      JSON.parse(queryStr)
    );

    return this;
  }

  /**
   * Applies sorting to the query based on the query string.
   * @returns {QueryHandler<T>} The current instance of the QueryHandler.
   */
  sort(): QueryHandler<T> {
    if (this.queryString.sort) {
      const sortBy = (this.queryString.sort as string).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  /**
   * Limits the fields of the documents returned by the query.
   * @returns {QueryHandler<T>} The current instance of the QueryHandler.
   */
  limitFields(): QueryHandler<T> {
    if (this.queryString.fields) {
      const fields = (this.queryString.fields as string).split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-createdAt -updatedAt -__v");
    }

    return this;
  }

  /**
   * Applies pagination to the query based on the query string.
   * @returns {QueryHandler<T>} The current instance of the QueryHandler.
   * @throws {Error} If the page requested does not exist.
   */
  paginate(): QueryHandler<T> {
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
