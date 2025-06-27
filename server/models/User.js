// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     minlength: 3,
//     maxlength: 30
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   credits: {
//     type: Number,
//     default: 5,
//     min: 0
//   },
//   subscription: {
//     type: String,
//     enum: ['free', 'starter', 'professional', 'enterprise'],
//     default: 'free'
//   },
//   subscriptionExpiry: {
//     type: Date
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   lastLogin: {
//     type: Date
//   },
//   preferences: {
//     defaultLanguage: {
//       type: String,
//       default: 'en'
//     },
//     defaultGenre: {
//       type: String,
//       default: 'fiction'
//     },
//     emailNotifications: {
//       type: Boolean,
//       default: true
//     }
//   }
// }, {
//   timestamps: true
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Compare password method
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// // Get user profile (without password)
// userSchema.methods.getProfile = function() {
//   const userObject = this.toObject();
//   delete userObject.password;
//   return userObject;
// };

// module.exports = mongoose.model('User', userSchema);

// Mock User model for demo
class MockUser {
  constructor(data = {}) {
    this._id = data._id || 'mock-user-id';
    this.username = data.username || 'demo-user';
    this.email = data.email || 'demo@example.com';
    this.credits = data.credits || 5;
    this.subscription = data.subscription || 'free';
    this.isActive = data.isActive !== false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  async comparePassword(candidatePassword) {
    return candidatePassword === 'password123';
  }

  getProfile() {
    const { password, ...profile } = this;
    return profile;
  }

  static async findById(id) {
    return new MockUser({ _id: id });
  }

  static async findOne(query) {
    if (query.email === 'demo@example.com') {
      return new MockUser();
    }
    return null;
  }

  static async create(data) {
    return new MockUser(data);
  }

  async save() {
    return this;
  }
}

module.exports = MockUser; 