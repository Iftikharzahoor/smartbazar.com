import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import ApiFeatures from '../utils/apiFeatures.js';

// @desc    List products with advanced filtering, search, sorting & pagination
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    // Resolve category name/alias to ObjectId if category query parameter is a string and not an ObjectId
    if (req.query.category && !mongoose.Types.ObjectId.isValid(req.query.category)) {
      let catName = req.query.category.trim();
      let regexPattern = `^${catName}$`;
      if (catName.toLowerCase() === 'electronic' || catName.toLowerCase() === 'electronics') {
        regexPattern = '^electronics?$';
      } else if (catName.toLowerCase() === 'fashion' || catName.toLowerCase() === 'apparel' || catName.toLowerCase() === 'fashion & apparel') {
        regexPattern = '^(fashion|apparel|fashion & apparel)$';
      } else if (catName.toLowerCase() === 'home' || catName.toLowerCase() === 'living' || catName.toLowerCase() === 'home & living') {
        regexPattern = '^(home|living|home & living)$';
      } else if (catName.toLowerCase() === 'beauty' || catName.toLowerCase() === 'wellness' || catName.toLowerCase() === 'beauty & wellness') {
        regexPattern = '^(beauty|wellness|beauty & wellness)$';
      } else {
        regexPattern = `^${catName}s?$`;
      }
      
      const categoryDoc = await Category.findOne({
        name: { $regex: new RegExp(regexPattern, 'i') }
      });
      
      if (categoryDoc) {
        req.query.category = categoryDoc._id.toString();
      } else {
        // Fallback: if category not found, query with dummy ObjectId so it returns empty list cleanly
        req.query.category = new mongoose.Types.ObjectId().toString();
      }
    }

    const resPerPage = parseInt(req.query.limit, 10) || 12;

    // Get overall count matching keywords & filters before final pagination skip
    const apiFeaturesCount = new ApiFeatures(Product.find({ isActive: true }), req.query)
      .search()
      .filter();

    let countQuery = await apiFeaturesCount.query;
    const filteredProductsCount = countQuery.length;

    // Final paginated list query
    const apiFeatures = new ApiFeatures(Product.find({ isActive: true }), req.query)
      .search()
      .filter()
      .sort()
      .paginate();

    const products = await apiFeatures.query.populate('category');

    res.status(200).json({
      success: true,
      count: products.length,
      filteredProductsCount,
      resPerPage,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product || !product.isActive) {
      return next(new ErrorResponse('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by SEO slug
// @route   GET /api/v1/products/slug/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('category');
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(8).populate('category');

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products in same category
// @route   GET /api/v1/products/related/:id
// @access  Public
export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
      .limit(4)
      .populate('category');

    res.status(200).json({
      success: true,
      products: related
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin only)
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    // If files uploaded, parse image paths
    if (req.uploadedImages && req.uploadedImages.length > 0) {
      req.body.images = req.uploadedImages;
    }

    // Parse specifications, features, tags if sent as JSON strings (multipart form submission)
    if (typeof req.body.specifications === 'string') {
      req.body.specifications = JSON.parse(req.body.specifications);
    }
    if (typeof req.body.features === 'string') {
      req.body.features = JSON.parse(req.body.features);
    }
    if (typeof req.body.tags === 'string') {
      req.body.tags = JSON.parse(req.body.tags);
    }

    // Verify category exists
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return next(new ErrorResponse('Selected category does not exist', 400));
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // If new files uploaded, append or replace images
    if (req.uploadedImages && req.uploadedImages.length > 0) {
      req.body.images = req.uploadedImages;
    }

    if (typeof req.body.specifications === 'string') {
      req.body.specifications = JSON.parse(req.body.specifications);
    }
    if (typeof req.body.features === 'string') {
      req.body.features = JSON.parse(req.body.features);
    }
    if (typeof req.body.tags === 'string') {
      req.body.tags = JSON.parse(req.body.tags);
    }

    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return next(new ErrorResponse('Selected category does not exist', 400));
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft-delete product (Admin only)
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Soft delete to maintain consistency with existing customer purchase orders
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product soft-deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit review on product (1 per user per product)
// @route   POST /api/v1/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res, next) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Check if user has already reviewed
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return next(new ErrorResponse('You have already submitted a review for this product', 400));
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    // Recalculate average star ratings
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    next(error);
  }
};
