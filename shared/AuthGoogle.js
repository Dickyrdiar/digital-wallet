// // /* eslint-disable no-undef */
// require('dotenv').config()
// const passport = require('passport')
// const user = require('../model/user')
// const GoogleStrategy = require('passport-google-oauth20').Strategy()

// passport.use(new GoogleStrategy({
//   // clientID: GOOGLE_CLIENT_ID,
//   // clientSecret: GOOGLE_CLIENT_SECRET,
//   // callback: 'http://localhost:3001/api/v1/wallets',
//   // passReqToCallback: true
// },
// function (requets, accessToke, refreshToken, profile, done) {
//   user.create({ googleId: profile.id }, function (err, user) {
//     return done(err, user)
//   })
// }
// ))

// // module.exports = passport
