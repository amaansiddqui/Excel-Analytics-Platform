import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  }
});


// Add virtual to userSchema
userSchema.virtual('files', {
  ref: 'Upload',         // must match model name for files (see below)
  localField: '_id',
  foreignField: 'userId',
  justOne: false
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });


const User = mongoose.model('User', userSchema);
export  default User;
