const express=require('express');
const app=express();
let goodsData=require('./goods');
let apiRoutes = express.Router();
apiRoutes.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
apiRoutes.get('/goods', function (req, res,next) {
  res.json(goodsData);
});
app.use('/api', apiRoutes);
app.listen(4000);
