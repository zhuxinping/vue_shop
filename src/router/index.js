import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '../views/GoodsList';
import Cart from '../views/Cart';
import Address from '../views/Address.vue';
import OrderConfirm from '../views/OrderConfirm.vue';
import OrderSuccess from '../views/OrderSuccess.vue';
Vue.use(Router);

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      component: GoodsList
    },
    {
      path: '/cart',
      component: Cart
    },
    {
      path: '/address',
      component: Address
    }
    ,
    {
      path: '/orderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderSuccess',
      component: OrderSuccess
    }
  ]
})
