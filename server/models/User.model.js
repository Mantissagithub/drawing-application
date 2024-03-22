const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 32,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    minlength: 8,
    maxlength: 128,
    unique: true,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  passwordHash: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Set virtual property for returning encrypted version of the stored password.
UserSchema.virtual('password').set(function (value) {
  this._plainTextPassword = value;
}).get(function () {
  return this._plainTextPassword;
});

// Pre-save hook updating the passwordHash field.
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  const rounds = parseInt(process.env.BCRYPT_ROUNDS);

  bcrypt.hash(this.password, rounds, (err, hash) => {
    if (err) return next(err);

    this.passwordHash = hash;
    this._plainTextPassword = undefined;
    next();
  });
});

// Method comparing plaintext password against saved passwordHash.
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.passwordHash);
};

// Export the User model.
module.exports = mongoose.model('User', UserSchema);