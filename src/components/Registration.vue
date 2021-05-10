<template>
  <div class="container">
    <h1 class="display-1 text-secondary text-center bg-light">Cowin-Lite</h1>

    <div class="content mt-4">
      <p>
        Do you want to get notified as soon as the slots are available in
        <span class="text-danger">Seoni</span>?
      </p>
      <p>
        Then register yourself here and get notifications on your mail
      </p>
    </div>

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
        Check your mail once, you must have gotten a confirmation email from
        <strong>appdjango99@gmail.com</strong><br />
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

    <div class="footer bg-dark">
      Made with love by a proud Seonian<br />
      Dev Vishwakarma
      <a
        href="https://www.linkedin.com/in/divya-vishwakarma-4856ba143/"
        target="_blank"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-linkedin"
          viewBox="0 0 16 16"
        >
          <path
            d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"
          />
        </svg>
      </a>
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
          await sendMail(this.userEmail, "Registration successfull!!!");
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

<style scoped>
#app {
  color: #2c3e50;
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  color: white;
  text-align: center;
}

a {
  text-decoration: none;
  color: #0077b5;
}
</style>
