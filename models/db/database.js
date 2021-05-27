const sqlite = require('sqlite3').verbose();

//Connects to the database
let db = new sqlite.Database('./models/db/database.db', (err) => {
  if(err){
    console.error(err.message);
  }
  console.log('Connected to database');
})

let create_table_users = `CREATE TABLE users(
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      username TEXT NOT NULL UNIQUE,
                      password TEXT NOT NULL
                      )`;
let create_table_messages = `CREATE TABLE messages(
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        timestamp DATE NOT NULL,
                        sender TEXT NOT NULL,
                        recipent TEXT NOT NULL,
                        text TEXT,
                        mediaId TEXT
                        )`;
let create_table_media = `CREATE TABLE media(
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      type TEXT NOT NULL,
                      metaOrd BLOB,
                      metaExif BLOB,
                      metaXmp BLOB,
                      metaIcc BLOB,
                      url TEXT
                      )`;                       

//If the tables are not created, we create them
db.run(create_table_users, [], function(err) {
  if(err){
    return console.log(err.message);
  }
  console.log('Users table has been created');
});

db.run(create_table_messages, [], function(err) {
  if(err){
    return console.log(err.message);
  }
  console.log('Messages table has been created');
});

db.run(create_table_media, [], function(err) {
  if(err){
    return console.log(err.message);
  }
  console.log('Media table has been created');
});

module.exports = db;