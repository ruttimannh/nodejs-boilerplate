const user = require('../models/user');
const db = require('../models/db/database.js');

/**
 * Creates a user.
 */
module.exports.createUser = async (req, res) => {
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
    //Call the database and insert the new user
    var create_user_query = `INSERT INTO users (username, password) VALUES (?,?)`;
    var params = [data.username, data.password];
    db.run(create_user_query, params, function(err, result){
      if(err){
        res.status(400).json({'database error': err.message});
        return;
      }
      res.status(200).json({
        'id': this.lastID
      });
    });
  }catch(e){console.log(e)}
  
}