const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  manifesto: {
    type: String,
    default: 'No manifesto provided.'
  },
  position: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  year: {
    type: String,
    default: 'Not Specified'
  }
}, { timestamps: true });

const electionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  positions: [{
    name: {
      type: String,
      required: true
    },
    candidates: [candidateSchema]
  }],
  voters: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    votedAt: {
      type: Date,
      default: null
    }
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  results: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Election', electionSchema);
