<template>
  <div class="nav-breadcrumb-wrap">
    <div class="container">
      <nav class="nav-breadcrumb">
        <a href="/">Home</a>
        <slot></slot>
      </nav>
    </div>
  </div>
</template>

<script>
    export default {
        name: "m-bread",
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style scoped>

</style>
