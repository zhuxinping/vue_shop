var express = require('express');
var router = express.Router();
require('./../util/util');
let User=require('./../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//登录接口
router.post("/login",function (req,res,next) {
  let param={
    userName:req.body.userName,
    userPwd:req.body.userPwd
  };
  console.log(param)
  User.findOne(param,function (err,doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else {
      if(doc){
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*60*60
        });
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:1000*60*60
        });
       // req.session.user=doc;
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:doc.userName
          }
        });
      }
    }
  });
});
//登出接口
router.post("/logout",function (req,res,next) {
  res.cookie("userId","",{
    path:"/",
    maxAge:-1
  });
  res.json({
    status:"0",
    msg:'',
    result:''
  });
});
//校验
router.get("/checkLogin",function (req,res,next) {
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName||''
    });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
});
//查询当前用户的购物车数据
router.get('/cartList',function (req,res,next) {
  let userId=req.cookies.userId;
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        });
      }
    }
  });
});
//购物车删除
router.post('/cart/del',function (req,res,next) {
  let userId=req.cookies.userId;
  let productId=req.body.productId;
  User.update({userId:userId},{$pull:{'cartList':{'productId':productId}}},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:'删除失败!'
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'删除成功!'
      });
    }
  });
});
//修改商品数量
router.post('/cart/edit',function (req,res,next) {
  let userId=req.cookies.userId;
  let item=req.body.item;
  User.findOne({userId:userId},function (err,userDoc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message
      });
    }else{
      //console.log(userDoc);
      if(userDoc){
        let goodsItem=userDoc.cartList.find(product=>product.productId==item.productId);
        if(goodsItem){
          goodsItem.productNum=item.productNum;
          goodsItem.checked=item.checked;
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
        }
      }
    }
  });
});
//购物车修改
router.post('/editCheckAll',function (req,res,next) {
  let userId=req.cookies.userId;
  let checkAll=req.body.checkAll?'1':'0';
  User.findOne({userId:userId},function (err,user) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(user){
        user.cartList.forEach(item=>{
          item.checked=checkAll;
        });
        user.save(function (err1,doc) {
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            });
          }else{
            res.json({
              status:'0',
              msg:'',
              result:''
            });
          }
        });
      }

    }
  });

});
//查询用户地址接口
router.get("/addressList",function (req,res,next) {
  let userId=req.cookies.userId;
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        mgs:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      });
    }
  });
});
//更改默认地址
router.post("/setDefault",function (req,res,next) {
  let userId=req.cookies.userId;
  let addressId=req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId is null',
      result:''
    });
  }else{
    User.findOne({userId:userId},function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        var addressList=doc.addressList;
        addressList.forEach((item)=>{
            if(item.addressId==addressId){
              item.isDefault=true;
            }else{
              item.isDefault=false;
            }
        });
        doc.save(function (err1,doc1) {
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            });
          }else{
            res.json({
              status:'0',
              msg:'',
              result:''
            });
          }
        });
      }
    });
  }
});
//删除地址接口
router.post("/delAddress",function (req,res,next) {
  let userId=req.cookies.userId;
  let addressId=req.body.addressId;
  User.update({userId:userId},{
    $pull:{
      'addressList':{
        'addressId':addressId
      }
    }
  },function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:''
      });
    }
  });
});
router.post('/payMent',function (req,res,next) {
  let userId=req.cookies.userId;
  let addressId=req.body.addressId;
  let orderTotal=req.body.orderTotal;
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      let address='';
      let goodList=[];
      //获取用户的地址信息
      doc.addressList.forEach((item)=>{
        if(addressId==item.addressId){
          address=item;
        }
      });
      //获取购物车的购买商品
      doc.cartList.filter((item)=>{
        if(item.checked=='1'){
          goodList.push(item);
        }
      });
      let platfrom='622';
      let r1=Math.floor(Math.random()*10);
      let r2=Math.floor(Math.random()*10);
      let sysDate=new Date().Format('yyyyMMddhhmmss');
      let createDate=new Date().Format('yyyy-MM-dd hh:mm:ss');
      let orderId=platfrom+r1+sysDate+r2;
      let order={
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodList:goodList,
        orderStatus:'1',
        createDate:createDate
      };
      doc.orderList.push(order);
      doc.save(function (err1,doc1) {
        if(err1){
          res.json({
            status:'1',
            msg:err1.message,
            result:''
          });
        }else{
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          });
        }
      });
    }
  });
});
//根据订单id订单详情
router.get('/orderDetail',function (req,res,next) {
  let userId=req.cookies.userId;
  let orderId=req.query.orderId;
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      let orderList=doc.orderList;
      let orderTotal=0;
      if(orderList.length>0){
          orderList.forEach(item=>{
            if(item.orderId==orderId){
               orderTotal=item.orderTotal;
            }
          });
          if(orderTotal>0){
            res.json({
              status:'0',
              msg:'',
              result:{
                orderId:orderId,
                orderTotal:orderTotal
              }
            });
          }else{
            res.json({
              status:'120002',
              msg:'没有此订单',
              result:''
            });
          }
      }else{
        res.json({
          status:'120001',
          msg:'当前用户未创建订单',
          result:''
        });
      }
    }
  });

});
router.get("/getCartCount",function (req,res,next) {
  if(req.cookies&&req.cookies.userId){
    let userId=req.cookies.userId;
    User.findOne({userId:userId},function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        let cartList=doc.cartList;
        let cartCount=0;
        cartList.map(item=>{
          cartCount+=parseInt(item.productNum);
        });
        res.json({
          status:'0',
          msg:'',
          result:cartCount
        });
      }
    });
  }
});
module.exports = router;
