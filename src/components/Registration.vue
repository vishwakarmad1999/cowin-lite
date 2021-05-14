<template>
  <div class="container">
    <div class="form-container row">
      <div class="col-md-10 col-12">
        <input
          type="email"
          placeholder="Enter your email please!"
          v-model="userEmail"
          class="form-control"
          :required="true"
          @keyup="handleKeyUp"
        />
      </div>
      <div class="col-md-2 col-12 d-grid">
        <button
          class="btn btn-success"
          :disabled="loading"
          @click="registerUser"
        >
          Register
        </button>
      </div>
    </div>
    <br />
    <div class="alert alert-success" v-if="message" role="alert">
      <h4 class="alert-heading">Important Note</h4>
      <p>
        Your registration has been confirmed.<br />
        <strong>Check your mail once</strong>. You must have gotten a
        confirmation email from <strong>appdjango99@gmail.com</strong><br />
        This email id will be used to notify you when slots are available.
      </p>
    </div>

    <div class="alert alert-warning" v-else-if="error === true" role="alert">
      <h4 class="alert-heading">Invalid email</h4>
      <p>
        The email: <strong>{{ userEmail }}</strong> is not valid.
      </p>
    </div>

    <div
      class="alert alert-danger"
      v-else-if="error === 'invalid'"
      role="alert"
    >
      <h4 class="alert-heading">Duplication Found</h4>
      <p>
        This email is already registered with us.
      </p>
    </div>
  </div>
</template>

<script>
import { createUser, sendMail } from "../service";

export default {
  name: "Registration",
  data() {
    return {
      userEmail: "",
      loading: false,
      error: false,
      message: false,
      emailRegex: null,
    };
  },
  created() {
    this.emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  },
  methods: {
    handleKeyUp() {
      this.error = false;
      this.message = false;
    },
    async registerUser() {
      if (this.emailRegex.test(this.userEmail)) {
        this.loading = true;
        this.message = false;
        this.error = false;
        const result = await createUser(this.userEmail);
        if (result === 201) {
          const message =
            "Hey Pal<br/>" +
            "You will soon be receiving emails as soon as the slots are available in <strong>Seoni</strong>. " +
            "Just do me a favour by turning on sync of your email application like Gmail, Outlook, etc. By doing so you will start receiving notifications if you haven't been receiving them.";
          await sendMail(
            this.userEmail,
            message,
            "Cowin-Lite Registration Confiramtion"
          );
          this.userEmail = "";
          this.message = true;
        } else {
          this.error = "invalid";
        }
        this.loading = false;
      } else {
        this.error = true;
      }
    },
  },
};
</script>
