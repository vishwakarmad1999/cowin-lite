<template>
  <div class="container">
    <div class="logs mt-5">
      <h4
        v-for="[flag, now] of logs"
        :class="[
          flag ? 'bg-success display-4' : 'bg-secondary',
          'text-light lead',
        ]"
        :key="now"
      >
        <span>{{ now }}</span>
      </h4>
    </div>

    <div class="d-grid mt-5">
      <button class="btn btn-success" v-if="!timer" @click="initalize">
        Start Server
      </button>
      <button class="btn btn-danger" v-else @click="stopServer">
        Stop Server
      </button>
    </div>

    <audio
      src="https://dl.prokerala.com/downloads/ringtones/files/mp3/kirby-super-star-ost-kirby-super-star-3434.mp3"
      id="audio"
      loop
    ></audio>
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
      audio: null,
      timeDiff: 19800000,
    };
  },
  created() {
    window.addEventListener("beforeunload", function(e) {
      e.preventDefault();
      e.returnValue = "";
    });
  },
  beforeMount() {
    const password = prompt("Enter password");
    if (password !== "master_admin24jan99") {
      this.$router.push("/");
    }
  },
  mounted() {
    this.audio = document.getElementById("audio");
  },
  beforeUnmount() {
    this.timer = null;
  },
  methods: {
    async initalize() {
      this.timer = setInterval(async () => {
        const now = new Date();
        const temp = new Date(now.getTime() + this.timeDiff);
        const res = await axios.get(
          `${this.api}${temp.getDate()}-${temp.getMonth() +
            1}-${temp.getFullYear()}`
        );

        const result = await this.processData(res.data);
        this.logs.push([result, temp.toLocaleTimeString()]);
      }, 5000);
    },
    stopServer() {
      clearInterval(this.timer);
      this.timer = null;
      this.logs = [];
      this.audio.pause();
      this.currentTime = 0;
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
        this.audio.play();

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
.logs {
  height: 80vh;
  overflow-y: scroll;
  border: 1px solid black;
  text-align: center;
}
</style>
