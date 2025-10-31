import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false // Only required for standard sign-up
  },
  image: {
    type: String
  },
  role: {
    type: String,
    enum: ['alumni', 'student', 'admin'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'blocked'],
    default: 'pending'
  }
}, { timestamps: true }); // adds createdAt and updatedAt automatically

export default mongoose.model('User', userSchema);
