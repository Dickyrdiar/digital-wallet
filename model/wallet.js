/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WalletSchema = mongoose.Schema({
  userId: { type: String, require: true },
  balance: { type: Number, default: 0 },
  users: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  }
}, {
  timestamps: true,
  strictPopulate: false
})

module.exports = mongoose.model('Wallet', WalletSchema)
