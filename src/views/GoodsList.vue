<template>
<div>
  <MHeader></MHeader>
  <MBread>
    <span>Goods</span>
  </MBread>
  <div class="accessory-result-page accessory-page">
    <div class="container">
      <div class="filter-nav">
        <span class="sortby">Sort by:</span>
        <a href="javascript:void(0)" class="default cur">Default</a>
        <a @click="sortGoods" href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
        <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
      </div>
      <div class="accessory-result">
        <!-- filter -->
        <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
          <dl class="filter-price">
            <dt>Price:</dt>
            <dd><a @click="setPriceAll" :class="{'cur':priceChecked=='all'}" href="javascript:void(0)">All</a></dd>
            <dd v-for="(price,index) in priceFilter">
              <a  @click="serPriceFilter(index)" :class="{'cur':priceChecked==index}" :key="index" href="javascript:void(0)">{{price.startPrice}} - {{price.endPrice}}</a>
            </dd>
          </dl>
        </div>

        <!-- search result accessories list -->
        <div class="accessory-list-wrap">
          <div class="accessory-list col-4">
            <ul>
              <li v-for="(item,index) in goodsList" :key="index">
                <div class="pic">
                  <a href="#"><img v-lazy="`/static/${item.productImage}`" alt=""></a>
                </div>
                <div class="main">
                  <div class="name">{{item.productName}}</div>
                  <div class="price">￥{{item.salePrice}}</div>
                  <div class="btn-area">
                    <a @click="addCartData(item.productId)" href="javascript:;" class="btn btn--m">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
              <img v-show="loading" src="../../static/loading-svg/loading-spinning-bubbles.svg" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
  <Modal :mdShow="mdShow" v-on:close="closeModal">
    <p slot="message">请先登录,否则无法添加到购物车</p>
    <div slot="btnGroup">
      <a href="javascript:void(0)" @click="mdShow=false" class="btn btn--m">关闭</a>
    </div>
  </Modal>
  <Modal :mdShow="mdShowCart" v-on:close="closeModal">
    <p slot="message">
      <svg class="icon-status-ok">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
      </svg>
      <span>加入购物车成功!</span>
    </p>
    <div slot="btnGroup">
      <a href="javascript:void(0)" @click="mdShowCart=false" class="btn btn--m">继续购物</a>
      <router-link href="javascript:void(0)" class="btn btn--m" to="/cart">查看购物车</router-link>
    </div>
  </Modal>
  <MFooter></MFooter>
</div>
</template>

<script>
  import '../assets/css/base.css'
  import '../assets/css/product.css'
  import '../assets/css/login.css'
  import '../assets/css/checkout.css'
  import MHeader from '../components/MHeader'
  import MFooter from '../components/MFooter'
  import MBread from '../components/MBread'
  import Modal from '../components/Modal.vue'
  import {getGoods,addCart} from "../api";
  export default {
        name: "goods-list",
        data() {
            return {
              goodsList:[],
              priceFilter:[
                {
                  startPrice:'0.00',
                  endPrice:'100.00',
                },
                {
                  startPrice:'100.00',
                  endPrice:'500.00',
                },
                {
                  startPrice:'500.00',
                  endPrice:'1000.00',
                },
                {
                  startPrice:'1000.00',
                  endPrice:'5000.00',
                }
              ],
              priceChecked:'all',
              filterBy:false,
              overLayFlag:false,
              sortFlag:true,
              page:1,
              pageSize:8,
              busy:false,
              loading:false,
              mdShow:false,
              mdShowCart:false
            }
        },
    created(){
          this.getGoodsData();
    },
        methods: {
          closeModal(){
            this.mdShow=false;
            this.mdShowCart=false;
          },
          async getGoodsData(flag){
            let param={
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag?1:-1,
              priceLevel:this.priceChecked
            };
            this.loading=true;
           let {status,result}= await getGoods(param);
           //console.log(result,status)
            this.loading=false;
            if(status==0){
              if(flag){
                //合并进来
                this.goodsList=this.goodsList.concat(result.list);
                if(result.count==0){
                  this.busy=true;
                }else{
                  this.busy=false;
                }
              }else{
                this.goodsList=result.list;
              }
            }else{
              this.goodsList=[];
            }
          },
          showFilterPop(){
            this.filterBy=true;
            this.overLayFlag=true;
          },
          closePop(){
            this.filterBy=false;
            this.overLayFlag=false;
          },
          serPriceFilter(index){
            this.priceChecked=index;
            this.filterBy=false;
            this.overLayFlag=false;
            this.page=1;
            this.getGoodsData();
          },
          setPriceAll(){
            this.priceChecked='all';
            this.filterBy=false;
            this.overLayFlag=false;
            this.page=1;
            this.getGoodsData();
          },
          sortGoods(){
            this.sortFlag=!this.sortFlag;
            this.page=1;
            this.getGoodsData();
          },
          loadMore(){
            this.busy=true;
            setTimeout(() => {
              this.page++;
              this.getGoodsData(true);
            }, 500);
          },
          async addCartData(productId){
             let {status,result,msg}= await addCart(productId);
            if(status=="0"){
              this.mdShowCart=true;
              this.$store.commit("updateCartCount",1);
            }else{
             this.mdShow=true;
            }
          }
          },
      components:{
        MHeader,
        MFooter,
        MBread,
        Modal
      }
    }
</script>

<style scoped>

</style>
