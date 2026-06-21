import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add notice content'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please add notice author'],
    default: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Notice = mongoose.model('Notice', NoticeSchema);
export default Notice;
