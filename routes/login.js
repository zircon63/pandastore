var jwt    = require('jsonwebtoken');
var mysql      = require('mysql');
var password_hash = require('password-hash');
var moment = require('moment');
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

exports.register = function(req,res){
  // console.log("req",req.body);
  var users={
    "login":req.body.login,
    "password":password_hash.generate(req.body.password),
    "phone":req.body.phone
  }
  connection.query('INSERT INTO user SET ?',users, function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "success":false,
        "message":"Error"
      });
    }else{
      console.log('The solution is: ', results);
      res.send({
        "success":true,
        "message":"Success registration!"
      });
    }
  });
}

exports.login = function(req,res){
  var login= req.body.login;
  var password = req.body.password;
  connection.query('SELECT * FROM user WHERE login = ?',[login], function (error, results, fields) {
    if (error) {
      // console.log("error ocurred",error);
      res.send({
        "success":false,
        "message":"error ocurred"
      })
    }else{
      // console.log('The solution is: ', results);
      if(results.length >0){
        if(password_hash.verify(password,results[0]['password'])){
          var isAdmin = results[0]['id_role']==0?true:false;
          var token = jwt.sign({login:login,admin:isAdmin}, req.app.get('superSecret'), {
            expiresIn: '1h'
          });
          res.send({
            "id": results[0]['id'],
            "login": results[0]['login'],
            "phone": results[0]['phone'],
            "success":true,
            "message":"Successful",
            "isAdmin": isAdmin,
            "token" : token
          });
        }
        else{
          res.send({
            "success":false,
            "message":"Does not match"
          });
        }
      }
      else{
        res.send({
          "success":false,
          "message":"Does not exist"
        });
      }
    }
  });
}

exports.getProfile = function(req,res){
  // console.log("req",req.body);
  var user_id = req.body.id;
  connection.query('SELECT orders.id as \'id\',statusOrder.name as \'status\',orders.date AS \'date\',product.name as \'name\',category.name as \'category\',orderProduct.amount as \'amount\',orders.total as \'total\'\n' +
    '  FROM orders,product,orderProduct,category,statusOrder WHERE\n' +
    'statusOrder.id=orders.status AND category.id = product.id_category AND orders.id = orderProduct.id_order AND orderProduct.id_product = product.id AND orders.id_user=? ORDER BY orders.id ASC',user_id, function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "success":false,
        "message":"Error get orders"
      })
    }else{
      //console.log('The solution is: ', results);
      var root = 0;
      var lastIndex = 0;
      results[0].date = moment(results[0].date).format("hh:mm DD-MM-YYYY");
      var tree = [{
        data: {date:results[root].date,status:results[root].status,total:results[root].total},
        children: [
          {
            data: {name:results[root].name,category:results[root].category,amount:results[root].amount}
          }
        ]
      }];
      for(var i=1;i<results.length;i++) {
        results[i].date = moment(results[i].date).format("hh:mm DD-MM-YYYY");
        if(results[root].id==results[i].id) {
          tree[lastIndex].children.push({
            data:{name:results[i].name,category:results[i].category,amount:results[i].amount}
            ,children:[]})
        }
        else {
          root = i;
          var order = {
            data: {date: results[i].date, status: results[i].status, total: results[i].total},
            children: [{data: {name: results[i].name, category: results[i].category, amount: results[i].amount}}]
          };
          lastIndex = tree.push(order) - 1;
        }
      }
      res.send({
        "success":true,
        "orders":tree
      });
    }
  });
}
