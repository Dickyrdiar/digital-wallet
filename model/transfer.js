const mongoose = require('mongoose')

const transferSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: { type: Number, required: true, default: 0 },
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: true
})

module.exports = mongoose.model('Transfer', transferSchema)
