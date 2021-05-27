const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('./config');


//Creates the token for a specific user and set an expiration date in 14 days
exports.createToken = function(user) {
  var payload = {
    'sub': user,
    'iat': moment().unix(),
    'exp': moment().add(14, "days").unix(),
  };
  
  return jwt.encode(payload, config.TOKEN_SECRET);
};