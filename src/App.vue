<template>
  <Header />
  <router-view></router-view>
</template>

<script>
import Header from "./components/Header.vue";

export default {
  components: { Header },
  name: "App",
};
</script>

<style>
body {
  font-family: "Quicksand", sans-serif;
}
</style>
