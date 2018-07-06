// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import notify from './plugin/notify';
import Vuex from 'vuex';
Vue.use(Vuex);
Vue.use(notify);
import VueLazyLoad from 'vue-lazyload';
import infiniteScroll from 'vue-infinite-scroll';
Vue.config.productionTip = false
Vue.use(VueLazyLoad, {
  loading: '/static/loading-svg/loading-bars.svg',
  try: 3 // default 1
});
Vue.use(infiniteScroll);
/* eslint-disable no-new */

const store=new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName=nickName;
    },
    //商品数量的加减
    updateCartCount(state,num){
        state.cartCount+=num;
    },
    //初始化 获取商品原始数量
    initCartCount(state,cartCount){
      state.cartCount=cartCount;
    }
  }
});
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
});
