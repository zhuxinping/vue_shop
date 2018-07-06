import modal from './notify.vue';
let notify={};//需要在此对象拥有一个install方法
//this.$notify('吃了吗?',{delay:1000})
notify.install=function (Vue,options={delay:3000}) {
console.log(Vue,options);
  Vue.prototype.$notify=function (message,opt={}) {
  options={...options,...opt}//用自己调用插件时传递过来的属性覆盖掉默认设置好
    if(notify.el) return;
   let V=Vue.extend(modal);//返回的是一个构造函数的子类,参数是包含组件选项的对象
    let vm=new V;
  let oDiv=document.createElement('div');//创建一个div将实例挂载到元素上
  vm.$mount(oDiv);
  vm.value=message;
  document.body.appendChild(vm.$el);
  //把当前实例存起来
    notify.el=vm.$el;
  setTimeout(()=>{
    document.body.removeChild(vm.$el);//将实例的元素删除
    notify.el=null;
  },options.delay);//延迟多少秒将dom元素移除
  }
};
export default notify;//导出这个对象 如果使用Vue.use就会调用这个install方法
