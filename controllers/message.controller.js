const db = require('../models/db/database');
const message = require('../models/message');

/**
 * Send a message from one user to another. 
 * We support three types of messages `text`, `image` and `video` 
 */
module.exports.send = async (req, res) => {
  try{
    //Check the parameters. If one is missing send 400
    var errors=[]
    if (!req.body.recipent){
        errors.push('No recipent specified');
    }
    if (!req.body.sender){
        errors.push('No sender specified');
    }
    if (!req.body.content){
        errors.push('No content specified');
    }
    if (errors.length){
        res.status(400).json({'error': errors.join(',')});
        return;
    }
    //Get all the data possible
    var data = {
        sender: req.body.sender,
        recipent : req.body.recipent,
        text: req.body.content.text,
        type: req.body.content.type,
        metaOrd: req.body.content.metaOrd,
        metaExif: req.body.content.metaExif,
        metaXmp: req.body.content.metaXmp,
        metaIcc: req.body.content.metaIcc,
        url: req.body.content.url
    }

    //Check that the token belongs to the correct user. In this case the message sender
    if(data.sender != req.user){
      return res.status(401).send({'error': "You don't have permission"});
    }

    //Insert the message in the database
    var create_message_query = `INSERT INTO messages (timestamp, sender, recipent, text, mediaId) 
                                  VALUES (DATETIME('now'),?,?,?,?)`;

    //Check if the message has media on it
    if(data.type == 'image' || data.type == 'video'){
      
      //First we need to insert the media in the media table to get the mediaId
      var create_media_query = `INSERT INTO media (type, metaOrd, metaExif, metaXmp, metaIcc, url) 
                                  VALUES (?,?,?,?,?,?)`;
      var mediaParams = [data.type, data.metaOrd, data.metaExif, data.metaXmp, data.metaIcc, data.url];
      
      //Media insert in media table
      db.run(create_media_query, mediaParams, function(err, result){
        if(err){
          res.status(400).json({error: err.message});
          return;
        }
        //Now we have the id and we can add it to a column on the message table
        var messageParams = [data.sender, data.recipent, data.text, this.lastID]; //this.lastID contains the mediaId
        
        //Message insert in messages table
        db.run(create_message_query, messageParams, function(err, result){
          if(err){
            res.status(400).json({error: err.message});
            return;
          }
          
          res.status(200).json({
            'id': this.lastID,
            'timestamp': result
          });
        });
      });

    //If it is a text message, we dont need to insert in media table 
    }else{
      var messageParams = [data.sender, data.recipent, data.text, undefined];
      
      //Insert on message table
      db.run(create_message_query, messageParams, function(err, result){
        if(err){
          res.status(400).json({error: err.message});
          return;
        }
        
        res.status(200).json({
          'id': this.lastID,
          'timestamp': result
        });
      });
    }
    
  }catch(e){
    console.log(e);
    res.status(400).json({error: 'Code error'});
  }
}

/**
 * Fetch all existing messages to a given recipient, within a range of message IDs.
 */
module.exports.get = async (req, res) => {
  try{
    //Check the parameters. If one is missing send 400
    var errors=[]
    if (!req.query.recipent){
        errors.push('No recipent specified');
    }
    if (!req.query.start){
        errors.push('No start specified');
    }
    if (errors.length){
        res.status(400).json({'error': errors.join(',')});
        return;
    }
    var data = {
        recipent: req.query.recipent,
        start : req.query.start,
        limit: req.query.limit || 100
    }

    //Check that the user matchs the recipent of the messages
    if(data.recipent != req.user){
      return res.status(401).send({'error': "You don't have permission"});
    }

    //Get all the messages recieved for that recipent
    //We use a Left Join to get the media information if necessary
    var get_messages_query = `SELECT messages.id,timestamp,sender,recipent,text,mediaId,type,url 
                              FROM messages 
                              LEFT JOIN media ON media.id = messages.mediaId
                              WHERE recipent=? AND messages.id >=? ORDER BY messages.id LIMIT ?`;
    var params = [data.recipent, data.start, data.limit];

    //Query all to get all the results
    db.all(get_messages_query, params, (err, result) =>{
      if(err){
        res.status(400).json({error: err.message});
        return;
      }
      var messages = [];
      //We loop the rows to match the json structure needed in the response
      result.forEach(row => {
        var message = {
          'id': row.id,
          'timestamp': row.timestamp,
          'sender': row.sender,
          'recipent': row.recipent,
          'content':{}
        }
        
        //If it is test, we add it
        if(row.text){
          message.content['type'] = 'text';
          message.content['text'] = row.text;
        //If it is media we add the url
        }else if(row.mediaId){
          message.content['type'] = row.type;
          message.content[row.type] = row.url; //Only send the url, if necesary send the metadata as well
        }
        messages.push(message); 
      });
      res.status(200).json({
        'messages': messages
      });
    });
  }catch(e){
    console.log(e);
    res.status(400).json({error: 'Code error'});
  }
};