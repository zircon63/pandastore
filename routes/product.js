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
  connection.query('SELECT product.id,product.name,product.description AS \'desc\',product.price_sale AS price,category.name as nameCat,category.id AS id_category FROM product,category WHERE product.id_category = category.id', function (error, results, fields) {
    if (error) {
      res.send({
        "success":false,
        "message":"Error get all product"
      })
    }else{
      results.forEach(function (prod) {
        prod.category = {value:prod.id_category,label:prod.nameCat}
        delete prod.id_category;
        delete prod.nameCat;
      });
      res.send({
        "success":true,
        "products":results
      });
    }
  });
}
exports.getAllList = function(req,res){
  //console.log("req",req.body);
  connection.query('SELECT product.id,product.name,product.description AS \'desc\',product.price_sale AS price_sale,product.price_buy AS price_buy,category.name as nameCat,category.id AS id_category FROM product,category WHERE product.id_category = category.id', function (error, results, fields) {
    if (error) {
      res.send({
        "success":false,
        "message":"Error get all products"
      })
    }else{
      results.forEach(function (prod) {
        prod.category = {value:prod.id_category,label:prod.nameCat}
        delete prod.id_category;
        delete prod.nameCat;
      });
      res.send({
        "success":true,
        "products":results
      });
    }
  });
}
exports.newProduct = function (req,res) {
  var product = {
    name: req.body.name,
    description:req.body.desc,
    id_category:req.body.category.value,
    price_sale:req.body.price_sale,
    price_buy:req.body.price_buy
  };
  connection.query("INSERT INTO product SET ?",product,function (error,results,fields) {
    if(error) {
      res.send({
        "success":false,
        "message": 'Error create'
      })
    }
    else {
      connection.query('SELECT product.id,product.name,product.description AS \'desc\',product.price_sale AS price_sale,product.price_buy AS price_buy,category.name as nameCat,category.id AS id_category FROM product,category WHERE product.id_category = category.id', function (error, results, fields) {
        if (error) {
          res.send({
            "success":false,
            "message":"Error get all products"
          })
        }else{
          results.forEach(function (prod) {
            prod.category = {value:prod.id_category,label:prod.nameCat}
            delete prod.id_category;
            delete prod.nameCat;
          });
          res.send({
            "success":true,
            "message":'Success create',
            "products":results
          });
        }
      });
    }
  })
}
exports.editProduct = function (req,res) {
  var id = req.body.id;
  var product = {
    name: req.body.name,
    description:req.body.desc,
    id_category:req.body.category.value,
    price_sale:req.body.price_sale,
    price_buy:req.body.price_buy
  };
  connection.query("UPDATE product SET ? WHERE product.id="+id,product,function (error,results,fields) {
    if(error) {
      console.log(error)
      res.send({
        "success":false,
        "message": 'Error update'
      })
    }
    else {
      connection.query('SELECT product.id,product.name,product.description AS \'desc\',product.price_sale AS price_sale,product.price_buy AS price_buy,category.name as nameCat,category.id AS id_category FROM product,category WHERE product.id_category = category.id', function (error, results, fields) {
        if (error) {
          res.send({
            "success":false,
            "message":"Error get all products"
          })
        }else{
          results.forEach(function (prod) {
            prod.category = {value:prod.id_category,label:prod.nameCat}
            delete prod.id_category;
            delete prod.nameCat;
          });
          res.send({
            "success":true,
            "message":'Successful update',
            "products":results
          });
        }
      });
    }
  })
}
exports.deleteProduct = function (req,res) {
  var id = req.params.id;
  connection.query("DELETE FROM product WHERE product.id="+id,function (error,results,fields) {
    if(error) {
      res.send({
        "success":false,
        "message": 'Error delete'
      })
    }
    else {
      res.send({
        "success":true,
        "message": 'Successful delete'
      })
    }
  })
}
exports.getByCategoryId = function (req,res) {
  var idCat = req.params.idcat;
  connection.query('SELECT product.id,product.name,product.description AS \'desc\',product.price_sale AS price_sale,product.price_buy AS price_buy,category.name as nameCat,category.id AS id_category FROM product,category WHERE product.id_category = category.id AND product.id_category='+idCat, function (error, results, fields) {
    if (error) {
      res.send({
        "success":false,
        "message":"Error get all products"
      })
    }else{
      results.forEach(function (prod) {
        prod.category = {value:prod.id_category,label:prod.nameCat}
        delete prod.id_category;
        delete prod.nameCat;
      });
      res.send({
        "success":true,
        "products":results
      });
    }
  });
}

