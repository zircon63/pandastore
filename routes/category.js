var jwt    = require('jsonwebtoken');
var mysql      = require('mysql');
var db_config = {
  host     : 'localhost',
  database : 'pandastore',
  user     : 'root',
  password : ''
};
var connection = mysql.createConnection(db_config);
function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

exports.getAll = function(req,res){
  // console.log("req",req.body);
  connection.query('SELECT id AS value, name as label FROM category', function (error, results, fields) {
    if (error) {
      res.send({
        "success":false,
        "message":"Error get all category"
      })
    }else{
      res.send({
        "success":true,
        "categories":results
      });
    }
  });
}

exports.newCategory = function (req,res) {
  var category = {name:req.body.label};
  connection.query('INSERT INTO category SET ?',category,function (error,results,fields) {
    if(error) {
      console.log(error);
      res.send({
        "success":false,
        "message": 'Error create'
      })
    }
    else {
      connection.query('SELECT id AS value, name as label FROM category', function (error, results, fields) {
        if (error) {
          res.send({
            "success":false,
            "message":"Error get all category"
          })
        }else{
          res.send({
            "success":true,
            "message": 'Success create',
            "categories": results
          })
        }
      });
    }
  })
}
exports.editCategory = function (req,res) {
  var id = req.body.value;
  var category = {name:req.body.label};
  connection.query("UPDATE category SET ? WHERE category.id="+id,category,function (error,results,fields) {
    if(error) {
      console.log(error);
      res.send({
        "success":false,
        "message": 'Error update'
      })
    }
    else {
      connection.query('SELECT id AS value, name as label FROM category', function (error, results, fields) {
        if (error) {
          res.send({
            "success":false,
            "message":"Error get all category"
          })
        }else{
          res.send({
            "success":true,
            "message": 'Success update',
            "categories": results
          })
        }
      });

    }
  })
}

exports.deleteCategory = function (req,res) {
  var id = req.params.id;
  connection.query("DELETE FROM category WHERE category.id="+id,function (error,results,fields) {
    if(error) {
      console.log(error)
      res.send({
        "success":false,
        "message": 'Error delete'
      })
    }
    else {
      connection.query('SELECT id AS value, name as label FROM category', function (error, results, fields) {
        if (error) {
          res.send({
            "success":false,
            "message":"Error get all category"
          })
        }else{
          res.send({
            "success":true,
            "message": 'Success update',
            "categories": results
          })
        }
      });
    }
  });
}
