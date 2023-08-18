const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  },
  stripeCostumerId: { type: String }

}, {
  // strictPopulate: false,
  timestamps: true
})

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
  } catch (err) {
    next(err)
  }
})

module.exports = mongoose.model('User', UserSchema)
