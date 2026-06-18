import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add a coupon code'],
    unique: true,
    trim: true,
    uppercase: true
  },
  discountType: {
    type: String,
    enum: ['percent', 'fixed'],
    required: [true, 'Please specify discount type (percent or fixed)']
  },
  discountAmount: {
    type: Number,
    required: [true, 'Please specify the discount amount value']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please add a coupon expiry date']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Check if coupon is expired
CouponSchema.methods.isExpired = function () {
  return Date.now() > this.expiryDate;
};

const Coupon = mongoose.model('Coupon', CouponSchema);

export default Coupon;
