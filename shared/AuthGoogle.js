require('dotenv').config()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy()

passport.use(new GoogleStrategy({
  clientID: '',
  clientSecret: '',
  callbackURl: ''
}, (accessToken, refreshtoken, profile, done) => {
  return done(null, profile, accessToken, refreshtoken)
}))

module.exports = passport
