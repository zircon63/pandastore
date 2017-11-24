var express    = require("express");
var app = express();
var router = express.Router();
var jwt    = require('jsonwebtoken');
var login = require('./routes/login');
var products = require('./routes/product');
var categories = require('./routes/category');
var stats = require('./routes/stats');
var orders = require('./routes/order');
var bodyParser = require('body-parser');
app.set('superSecret', 'panda');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static(__dirname+'/dist'));
app.all(/^(?!.*api).*$/,function (req,res) {
  res.status(200).sendFile(__dirname+'/dist/index.html');
});
router.post('/register',login.register);
router.post('/login',login.login);
router.post('/profile',login.getProfile);

router.post('/products',products.newProduct);
router.get('/products',products.getAllList);
router.get('/products/:idcat',products.getByCategoryId);
router.put('/products',products.editProduct);
router.delete('/products/:id',products.deleteProduct);

router.post('/category',categories.newCategory);
router.get('/category',categories.getAll);
router.put('/category',categories.editCategory);
router.delete('/category/:id',categories.deleteCategory);

router.get('/orders',orders.getAll);
router.get('/orders/liststatus',orders.getListStatus);
router.put('/orders',orders.edit);
router.delete('/orders/:id',orders.delete);
router.put('/buy',orders.performOrder);

router.post('/stats/product',stats.getStatsProduct);
router.get('/stats/income',stats.getIncome);
app.use('/api', router);
// test route
router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

app.listen(3000);



