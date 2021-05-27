const health = require('../models/health');
const db = require('../models/db/database.js');

/**
 * Checks if the app is running fine.
 */
module.exports.check = async (req, res) => {
  var check_list = {};
  if (db) {
    check_list['database'] = 'ok';
    db.get(`SELECT * FROM users LIMIT 1`, [], (err, result) => {
      if (err) {
        check_list['users'] = 'fail';
      } else {
        check_list['users'] = 'ok';
      }
    });
    db.get(`SELECT * FROM messages LIMIT 1`, [], (err, result) => {
      if (err) {
        check_list['messages'] = 'fail';
      } else {
        check_list['messages'] = 'ok';
      }
    });
  } else {
    check_list['database'] = 'fail';
  }

  check_list['version'] = 'Running version 1.1';
  res.json(check_list);
}