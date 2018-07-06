<template>
    <div>
      <MHeader></MHeader>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="../../static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{orderId}}</span>
              <span>Order total：{{orderTotal|currency('$')}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link class="btn btn--m" to="/cart">Cart List</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link class="btn btn--m" to="/">Goods List</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MFooter></MFooter>
    </div>
</template>
<script>
  import MHeader from '../components/MHeader'
  import MFooter from '../components/MFooter'
  import MBread from '../components/MBread'
  import Modal from '../components/Modal.vue'
  import {OrderDetail} from '../api/index'
  import {currency} from '../util/currency';
    export default {
        data() {
            return {
              orderId:'',
              orderTotal:0,
            }
        },
        created() {
          this.orderDetail();
        },
      filters:{
        currency:currency
      },
        methods: {
          async orderDetail(){
            let orderId=this.$route.query.orderId;
            if(!orderId){
              return;
            }
            let {status,result}=await OrderDetail(orderId);
            console.log(result);
            if(status=='0'){
                this.orderId=result.orderId;
                this.orderTotal=result.orderTotal;
            }
          }
        },
        computed: {},
        components: {
          MHeader,
          MFooter,
          MBread,
          Modal
        }
    }
</script>
<style scoped>

</style>
