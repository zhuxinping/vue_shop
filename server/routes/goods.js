let express=require('express');
let router=express.Router();
let mongoose=require('mongoose');
let Goods=require('../models/goods');

//链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/shop');
mongoose.connection.on("connected",function () {
  console.log("MongoDB connected success");
});
mongoose.connection.on("error",function () {
  console.log("MongoDB connected fail");
});
mongoose.connection.on("disconnected",function () {
  console.log("MongoDB connected disconnected");
});
//查询商品列表信息
router.get("/list",function (req,res,next) {
  //res.send("hello goods list");
  let page=parseInt(req.query.page);
  let pageSize=parseInt(req.query.pageSize);
  let priceLevel=req.query.priceLevel;
  let sort=req.query.sort;
  let skip=parseInt((page-1)*pageSize);
  let priceGt='',priceLte='';
  let params={};
  if(priceLevel!='all'){
    switch (priceLevel){
      case '0':priceGt=0;priceLte=100;break;
      case '1':priceGt=100;priceLte=500;break;
      case '2':priceGt=500;priceLte=1000;break;
      case '3':priceGt=1000;priceLte=5000;break;
    }
    //条件查询
    params={
      'salePrice':{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }

  //find查找分页
  let goodsModel=Goods.find(params).skip(skip).limit(pageSize);
  //按照价格排序
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else{
      res.json({
        status:'0',
        result:{
          count:doc.length,
          list:doc
        }
      });
    }
  });
});
//加入到购物车
router.post("/addCart",function (req,res,next) {
  let userId="1";
  let productId=req.body.productId;
  //console.log(productId)
  let User=require('../models/user');
  User.findOne({userId:userId},function (err,userDoc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message
      });
    }else{
      //console.log(userDoc);
      if(userDoc){
        let goodsItem=userDoc.cartList.find(item=>item.productId==productId);
        if(goodsItem){
          let num=parseInt(goodsItem.productNum);
            num++;
          goodsItem.productNum=num;
          userDoc.cartList=[...userDoc.cartList];
          userDoc.save(function (err1,doc) {
            if(err1){
              res.json({
                status:"1",
                msg:err1.message
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'success'
              });
            }
          })
        }else {
          Goods.findOne({productId:productId},function (err2,doc) {
            if(err2){
              res.json({
                status:"1",
                msg:err2.message
              })
            }else{
              if(doc){
                doc.productNum=1;
                doc.checked=1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err3,doc) {
                  if(err3){
                    res.json({
                      status:"1",
                      msg:err3.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'success'
                    });
                  }
                });
              }
            }
          });
        }
      }
    }
  });

  /*User.findOne({userId:userId},function (err,userDoc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      if(userDoc){
        let goodsItem='';
        userDoc.cartList.forEach(function (item) {
          if(item){
            if(item.productId===productId){
              goodsItem=item;
              item.productNum++;
            }
          }
        });
        if(goodsItem){
          userDoc.save(function (err3,doc3) {
            if(err3){
              res.json({
                status:"1",
                msg:err3.message
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'success'
              });
            }
          });
        }else{
          Goods.findOne({productId:productId},function (err1,doc) {
            if(err1){
              res.json({
                status:"1",
                msg:err1.message
              })
            }else{
              if(doc){
                doc.productNum=1;
                doc.checked=1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2,doc2) {
                  if(err2){
                    res.json({
                      status:"1",
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'success'
                    });
                  }
                });
              }
            }
          });
        }

      }
    }
  });*/
});
module.exports=router;
