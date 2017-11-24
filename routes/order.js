var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var moment = require('moment');
var db_config = {
  host: 'localhost',
  database: 'pandastore',
  user: 'root',
  password: ''
};
var connection = mysql.createConnection(db_config);

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function (err) {              // The server is either down
    if (err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

exports.performOrder = function (req, res) {
  var order = {
    'id_user': req.body.user_id,
    'date': moment().format('YYYY-MM-DD HH:mm:ss'),
    'status': 0,
    'total': req.body.total
  }
  connection.query('INSERT INTO orders SET ?', order, function (error, results, fields) {
    if (error) {
      console.log(error)
      res.send({
        "success": false,
        "message": "Error perform order"
      })
    } else {
      var id_order = results.insertId;
      var orderProduct = [];
      req.body.order.forEach(function (product) {
        orderProduct.push([product.id,id_order,product.amount]);
      });
      connection.query('INSERT INTO orderProduct (id_product,id_order,amount) VALUES ?', [orderProduct], function (error, results, fields) {
        if(error) {
          console.log(error)
          res.send({
            "success": false,
            "message": "Error perform order"
          })
        }
        else {
          res.send({
            "success": true,
            "message": "Order complete successfuly!"
          })
        }
      })
    }
  });
}

exports.getAll = function(req,res){
  // console.log("req",req.body);
  connection.query('SELECT orders.id as \'id\',statusOrder.name as \'status\',statusOrder.id as' +
    ' \'status_id\',orders.date AS \'date\',product.name as \'name\',category.name as \'category\',orderProduct.amount as \'amount\',orders.total as \'total\'\n' +
    '  FROM orders,product,orderProduct,category,statusOrder WHERE\n' +
    'statusOrder.id=orders.status AND category.id = product.id_category AND orders.id = orderProduct.id_order AND orderProduct.id_product = product.id ORDER BY orders.date DESC', function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "success":false,
        "message":"Error get orders"
      })
    }else{
      //console.log('The solution is: ', results);
      results.forEach(function (order) {
        order.date = moment(order.date).format("hh:mm DD-MM-YYYY");
      });
      res.send({
        "success":true,
        "orders":results
      });
    }
  });
}

exports.getListStatus = function (req,res) {
  connection.query("SELECT statusorder.id AS value,statusorder.name AS label FROM statusorder",function (error,results,fields) {
    if(error) {
      res.send({
        "success":false,
        "message":'Error get List Status'
      });
    }
    else {
      res.send({
        "success":true,
        "statusList":results
      });
    }
  })
}

exports.edit = function (req,res) {
  var id = req.body.id;
  var order = {
    status: req.body.status_id
  }
  connection.query("UPDATE orders SET ? WHERE orders.id="+id,order,function (error,results,fields) {
    if(error) {
      res.send({
        "success":false,
        "message":'Error update order'
      });
    }
    else {
      connection.query('SELECT orders.id as \'id\',statusOrder.name as \'status\',statusOrder.id as' +
        ' \'status_id\',orders.date AS \'date\',product.name as \'name\',category.name as \'category\',orderProduct.amount as \'amount\',orders.total as \'total\'\n' +
        '  FROM orders,product,orderProduct,category,statusOrder WHERE\n' +
        'statusOrder.id=orders.status AND category.id = product.id_category AND orders.id = orderProduct.id_order AND orderProduct.id_product = product.id ORDER BY orders.date DESC', function (error, results, fields) {
        if (error) {
          console.log("error ocurred",error);
          res.send({
            "success":false,
            "message":"Error get orders"
          })
        }else{
          //console.log('The solution is: ', results);
          results.forEach(function (order) {
            order.date = moment(order.date).format("hh:mm DD-MM-YYYY");
          });
          res.send({
            "success":true,
            "message":'Success update status',
            "orders":results
          });
        }
      });
    }
  });
}

exports.delete = function (req,res) {
  var id = req.params.id;
  connection.query("DELETE FROM orders WHERE orders.id="+id,function (error,results,fields) {
    if(error) {
      res.send({
        "success":false,
        "message":"Error delete order"
      })
    }
    else {
      connection.query('SELECT orders.id as \'id\',statusOrder.name as \'status\',statusOrder.id as' +
        ' \'status_id\',orders.date AS \'date\',product.name as \'name\',category.name as \'category\',orderProduct.amount as \'amount\',orders.total as \'total\'\n' +
        '  FROM orders,product,orderProduct,category,statusOrder WHERE\n' +
        'statusOrder.id=orders.status AND category.id = product.id_category AND orders.id = orderProduct.id_order AND orderProduct.id_product = product.id ORDER BY orders.date DESC', function (error, results, fields) {
        if (error) {
          console.log("error ocurred",error);
          res.send({
            "success":false,
            "message":"Error get orders"
          })
        }else{
          //console.log('The solution is: ', results);
          results.forEach(function (order) {
            order.date = moment(order.date).format("hh:mm DD-MM-YYYY");
          });
          res.send({
            "success":true,
            "message":'Success delete order',
            "orders":results
          });
        }
      });
    }
  })
}
