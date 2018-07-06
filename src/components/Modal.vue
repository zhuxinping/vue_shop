<template>
    <div>
      <div class="md-modal modal-msg md-modal-transition md-show" v-show="mdShow">
        <div class="md-modal-inner">
          <div class="md-top">
            <div class="md-title">Login in</div>
            <button @click="closeModal" class="md-close">Close</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <slot name="message"></slot>
            </div>
            <div class="login-wrap">
              <slot name="btnGroup"></slot>
            </div>
          </div>
        </div>
      </div>
      <div @click.stop="closeModal"  v-if="mdShow"  class="md-overlay"></div>
    </div>
</template>
<script>
    export default {
      props:{
        mdShow:{type:Boolean}
      },
        data() {
            return {msg: 'hello'}
        },
        created() {
        },
        methods: {
          closeModal(){
            this.$emit('close');
          }
        },
        computed: {},
        components: {}
    }
</script>
<style scoped>

</style>
