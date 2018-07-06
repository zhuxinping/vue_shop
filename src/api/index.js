import axios from 'axios';
//增加默认的请求路径
/*axios.defaults.baseURL='http://localhost:4000/api';*/
//拦截器
axios.interceptors.response.use((res)=>{
  return res.data;//在这里统一拦截把结果处理成res.data
});
//获取数据返回的是一个pomise对象
export let getGoods=(param)=>{
  return axios.get('/goods/list',{params:param});
};
export let addCart=(productId)=>{
  return axios.post('/goods/addCart',{productId:productId});
};
//登录
export let Login=(param)=>{
  return axios.post('/users/login',{...param});//对象展开
};
//登出
export let LogOut=()=>{
  return axios.post('/users/logout');
};
//校验登录
export let CheckLogin=()=>{
  return axios.get('/users/checkLogin');
};
//购物车商品列表
export let CartList=()=>{
  return axios.get('/users/cartList');
};
export let DelCart=(productId)=>{
  return axios.post('/users/cart/del',{productId:productId});
};
//商品加减
export let EditCart=(item)=>{
  return axios.post('/users/cart/edit',{item});
};
export let CheckAll=(checkAll)=>{
  return axios.post('/users/editCheckAll',{checkAll});
};
//地址列表
export let AddressList=()=>{
  return axios.get('/users/addressList');
};
//设置默认地址
export let SetAddress=(addressId)=>{
  return axios.post('/users/setDefault',{addressId});
};
//删除地址
export let DelAddress=(addressId)=>{
  return axios.post('/users/delAddress',{addressId});
};

//创建订单
export let PayMent=(param)=>{
  return axios.post('/users/payMent',{...param});
};
//订单详情
export let OrderDetail=(orderId)=>{
  return axios.get('/users/orderDetail',{params:{orderId:orderId}});
};
//获取购物车商品数量

export let GetCartCount=()=>{
  return axios.get('/users/getCartCount');
};



