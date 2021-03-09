const advancedResults = (model, populate) => async (req, res, next) => {
  // Initialize var
  let query;
  // Custom req.query
  const reqQuery = { ...req.query };
  // Fields to exclude in the query
  const removeFields = ["select", "sort", "page", "limit"];
  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  // Get query params
  let queryStr = JSON.stringify(reqQuery);
  // Create query str adding '$' to the query param
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // searching the database using that query str
  query = model.find(JSON.parse(queryStr));
  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  // Query sort and setting default sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  // Adding page and limit to the query
  query = query.skip(startIndex).limit(limit);

  // Add the populate to the query
  if (populate) {
    query = query.populate(populate);
  }
  // Awaiting the result
  const results = await query;
  // Pagination results
  const pagination = {};
  // Creating the next & prev in the pagination object for the response
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResults;
