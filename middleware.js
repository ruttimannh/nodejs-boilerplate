const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('./config');

//Library that proccess the request and check the authentication header. If its ok, continues to the controller
exports.ensureAuthenticated = function(req, res, next) {
  try{
    if(!req.headers.authorization) {
      return res.status(403).send({message: "Authorization header missing"});
    }
    
    var token = req.headers.authorization.split(" ")[1];
    var payload = jwt.decode(token, config.TOKEN_SECRET);
    
    if(payload.exp <= moment().unix()) {
       return res.status(401).send({message: "Token is expired"});
    }
    
    //Send the decoded user with the request to the controller
    req.user = payload.sub;
    next();
  }catch(e){
    console.log(e);
    res.status(400).json({error: 'Code error'});
  }
}