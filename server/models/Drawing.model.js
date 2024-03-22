const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RevisionSchema = new Schema({
  revisionId: {
    type: String,
    default: require('shortid'),
  },
  content: Object,
  createdAt: Date,
  updatedAt: Date,
});

RevisionSchema.pre('remove', function (next) {
  this.constructor.deleteMany({ _revisionParent: this._id }).exec();

  next();
});

const DrawingSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    default: '',
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  visibility: {
    type: Boolean,
    default: false,
  },
  revisions: [RevisionSchema],
}, { timestamps: true });

// Export the Drawing model.
module.exports = mongoose.model('Drawing', DrawingSchema);