<template>
  <div class="container">
    <div class="logs">
      <h4 v-for="([flag, now], index) of logs" class="lead" :key="now">
        <span :class="[flag ? 'bg-success text-light' : 'text-danger']"
          >{{ index + 1 }}. {{ now }}</span
        >
      </h4>
    </div>

    <div class="d-grid btn-container">
      <button class="btn btn-success" v-if="!timer" @click="initalize">
        Start Server
      </button>
      <button class="btn btn-danger" v-else @click="stopServer">
        Stop Server
      </button>
    </div>
  </div>
</template>

<script>
import { getUsers, sendMail, updateCurrent } from "../service";
import axios from "axios";

export default {
  name: "Server",
  data() {
    return {
      api:
        "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=480661&date=",
      timer: null,
      logs: [],
    };
  },
  methods: {
    async initalize() {
      this.timer = setInterval(async () => {
        const now = new Date();
        const res = await axios.get(
          `${this.api}${now.getDate()}-${now.getMonth() +
            1}-${now.getFullYear()}`
        );

        this.logs.push([await this.processData(res.data), now]);
      }, 10000);
    },
    stopServer() {
      clearInterval(this.timer);
      this.timer = null;
      this.logs = [];
    },
    async processData(res) {
      let message = "";
      const centers = res.centers;
      if (centers.length) {
        for (let j = 0; j < centers.length; j++) {
          const sessions = centers[j].sessions;
          if (sessions.length) {
            for (let k = 0; k < sessions.length; k++) {
              if (
                sessions[k].min_age_limit === 18 &&
                sessions[k].available_capacity > 0
              ) {
                message +=
                  "<strong>Date:</strong> " +
                  sessions[k].date +
                  "<br/>" +
                  "<strong>Center:</strong> " +
                  centers[j].name +
                  "<br/>" +
                  "<strong>Capacity:</strong> " +
                  sessions[k].available_capacity +
                  "<br/>" +
                  "<strong>Minimum Age:</strong> " +
                  sessions[k].min_age_limit +
                  "<br/><br/>";
              }
            }
          }
        }
      }

      if (message) {
        const users = await getUsers();

        users.forEach(async (user) => {
          if (user.current != message) {
            await sendMail(user.email, message);
          }
        });

        await updateCurrent(message);
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style scoped>
.btn-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.logs {
  height: 90vh;
  overflow-y: scroll;
  border: 1px solid black;
  text-align: center;
}
</style>