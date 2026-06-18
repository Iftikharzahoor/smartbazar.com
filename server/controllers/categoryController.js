import Category from '../models/Category.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category (Admin only)
// @route   POST /api/v1/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  const { name, description } = req.body;

  try {
    let category = await Category.findOne({ name });
    if (category) {
      return next(new ErrorResponse('Category already exists with this name', 400));
    }

    category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};
