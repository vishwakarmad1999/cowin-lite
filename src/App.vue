<template>
  <Header />
  <router-view></router-view>
  <Footer />
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default {
  components: { Header, Footer },
  name: "App",
};
</script>

<style>
body {
  font-family: "Quicksand", sans-serif;
}
</style>
