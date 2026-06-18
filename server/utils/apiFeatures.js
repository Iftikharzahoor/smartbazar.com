class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // 1. Text Search Keyword Matches
  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            { name: { $regex: this.queryStr.keyword, $options: 'i' } },
            { description: { $regex: this.queryStr.keyword, $options: 'i' } },
            { brand: { $regex: this.queryStr.keyword, $options: 'i' } },
            { tags: { $regex: this.queryStr.keyword, $options: 'i' } }
          ]
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // 2. Structured Fields Filtering (Category, Brand, Prices, Ratings)
  filter() {
    const queryCopy = { ...this.queryStr };

    // Fields to exclude from direct filtration mapping
    const removeFields = ['keyword', 'limit', 'page', 'sort', 'fields'];
    removeFields.forEach(el => delete queryCopy[el]);

    // Handle price range and rating filters (e.g. price[gte]=100 -> price: { $gte: 100 })
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    const parsedQuery = JSON.parse(queryStr);

    // If category is an ID or list, Mongoose automatically processes it
    this.query = this.query.find(parsedQuery);
    return this;
  }

  // 3. Sorting Options
  sort() {
    if (this.queryStr.sort) {
      // e.g. sort=price,-createdAt -> 'price -createdAt _id'
      const sortBy = this.queryStr.sort.split(',').join(' ') + ' _id';
      this.query = this.query.sort(sortBy);
    } else {
      // Default: show newest first
      this.query = this.query.sort('-createdAt _id');
    }
    return this;
  }

  // 4. Pagination Configs
  paginate() {
    const page = parseInt(this.queryStr.page, 10) || 1;
    const limit = parseInt(this.queryStr.limit, 10) || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;
