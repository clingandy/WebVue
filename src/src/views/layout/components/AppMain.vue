<template>
  <section class="app-main" style="min-height: 100%">
    <transition name="fade" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  },
  created: function(){
    if(this.$route.path === '/screw/productHistory' || this.$route.path === '/screw/clientAddress') {
      this.$route.meta.noCache = true;
    }
  }
  // watch: {
  //   '$route' () {
  //     if (this.$route.path === '/screw/productHistory') {
  //       this.$route.meta.noCache = true;
  //     }
  //   }
  // }
}
</script>
