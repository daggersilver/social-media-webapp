const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await User.findOne({
    $or: [
      {username: username},
      {email: username}
    ]
  });

  if(!user) {
    return cb(null, false, {message: 'Incorrect username or password'});
  }

  bcrypt.compare(password, user.password, function(err, res) {
    if(err) return cb(err);

    if(res) {
      return cb(null, user);
    }

    return cb(null, false, {message: 'Incorrect username or password'});
  });
}));


passport.serializeUser(function(user, cb){
  process.nextTick(function() {
    cb(null, {id: user._id, username: user.username, profileCreated: user.profileCreated});
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


module.exports = passport;