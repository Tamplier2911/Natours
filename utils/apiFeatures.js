class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    // FILTERING
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    const queryObjStr = JSON.stringify(queryObj);
    const filtereQuerydObj = JSON.parse(
      queryObjStr.replace(/\b(gte|gt|lte|lt)\b/gi, match => `$${match}`)
    );

    this.query = this.query.find(filtereQuerydObj);
    return this;
  }

  sort() {
    // SORTING
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limit() {
    // FIELD LIMITING
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // PAGINATION
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // page 1 = 1-10 | page 2 = 11 - 20 | page 3 = 21 - 30
    // if (this.queryString.page) {
    //   const numTours = await this.model.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exists!');
    // }
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
