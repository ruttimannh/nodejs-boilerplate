const login = require('../models/login');
const path = require('path');
const service = require(path.join('./','..','service.js'));
const db = require('../models/db/database.js')

/**
 * Login allows the user to authenticate with credentials 
 * and get a token to use on secured endpoints. 
 */
module.exports.login = (req, res) => {
  try{
    //Check the parameters. If one is missing send 400
    var errors=[]
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.username){
        errors.push("No username specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        username: req.body.username,
        password : req.body.password
    }
    //Get the user
    var get_user_query = `SELECT id, password FROM users WHERE username=?`;
    var params = [data.username];
    db.get(get_user_query, params, function(err, result){
      if(err){
        res.status(400).json({error: err.message});
        return;
      }
      if(!result){
        //If there is no result, then the user does not exist
        return res.status(401).send({'message': "Username does not exist"});
      }
      //Check if the password is correct
      if(data.password != result.password){
        return res.status(401).send({'message': "Password is incorrect"});
      }
      res.status(200).send({
        'id': result.id,
        'token': service.createToken(result.id) //Get the token for that user
      });
    });
  }catch(e){
    console.log(e)
    res.status(400).json({error: 'Code error'});
  }
};
