<template>
  <div class="box">
    <div class="container display-6 mb-5">
      <p>
        Do you want to get notified as soon as the slots are available in
        <span class="text-danger">Seoni</span>?
      </p>
      <p>
        Then register yourself here and get notifications on your mail
      </p>
      <p>
        Want to support for a cause.
        <router-link to="/support">Click Here</router-link>
      </p>
    </div>

    <registration />
  </div>
</template>

<script>
import Registration from "./Registration.vue";

export default {
  name: "Home",
  components: {
    Registration,
  },
};
</script>

<style scoped>
.box {
  margin-top: 3rem;
}
</style>
