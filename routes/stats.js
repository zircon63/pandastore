var jwt    = require('jsonwebtoken');
var mysql      = require('mysql');
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


exports.getStatsProduct = function (req,res) {
  var id = req.body.id;
  connection.query("SELECT orderProduct.amount as 'amount',orders.date FROM orderProduct,orders\n" +
    "WHERE orderProduct.id_product = "+id+" and orders.id = orderProduct.id_order and orders.status = 1 ORDER BY orders.date ASC",function (error,results,fields) {
    if(error) {
      res.send({
        "success":false,
        "message":"Error get stats for product"
      });
    }
    else {
      var stats = {
        labels: [],
        datasets:[{
          label: '',
          data: [],
          fill: false,
          borderColor: '#4bc0c0'
        }]
      };
      results.forEach(function (r) {
        stats.labels.push(moment(r.date).format("hh:mm DD-MM-YYYY"));
        stats.datasets[0].data.push(r.amount);
      })
      res.send({
        "success":true,
        "stats":stats
      });
    }
  })
}

exports.getIncome = function (req,res) {
  connection.query("SELECT SUM(orderProduct.amount*(product.price_sale-product.price_buy)) as 'income' FROM orderProduct,product,orders\n" +
    "WHERE product.id=orderProduct.id_product AND orders.id = orderProduct.id_order AND orders.status = 1",function (error,results,fields) {
    if(error) {
      res.send({
        "success":false,
        "message":"Error get income"
      });
    }
    else {
      res.send({
        "success":true,
        "income":results[0].income
      })
    }
  })
}
