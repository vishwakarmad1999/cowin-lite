<template>
  <div class="container">
    <div class="logs">
      <template v-if="log">
        <div :class="[log[0] ? 'bg-success' : 'bg-chill ', 'log display-4']">
          <div class="col-12">{{ log[1] }}</div>
          <div class="col-12">{{ log[2] }}</div>
          <div v-if="log[0]" class="col-12">{{ success }}</div>
        </div>
        <div class="card card-body text-secondary">
          <pre
            style="font-size: 10px"
            v-html="JSON.stringify(data, null, 2)"
          ></pre>
        </div>
      </template>

      <div v-if="error" class="bg-danger error display-4">
        {{ error }}
      </div>
    </div>

    <div class="d-grid mt-5">
      <button class="btn btn-success" v-if="!timer" @click="initialze">
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

    <audio id="erroraudio"></audio>
  </div>
</template>

<script>
import { getUsers, notifyBot, updateCurrent } from "../service";
import axios from "axios";
import errorAudio from "../assets/error.mp3";

export default {
  name: "Server",
  data() {
    return {
      api:
        "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=480661&date=",
      timer: null,
      log: null,
      audio: null,
      error: null,
      data: null,
      success: null,
      errorSound: null,
      errorTimer: null,
    };
  },
  created() {
    window.addEventListener("beforeunload", function(e) {
      e.preventDefault();
      e.returnValue = "";
    });
  },
  beforeMount() {
    if (location.hostname !== "localhost") {
      const password = prompt("Enter password");
      if (password !== "master_admin24jan99") {
        this.$router.push("/");
      }
    }
  },
  mounted() {
    this.audio = document.getElementById("audio");
    this.errorSound = document.getElementById("erroraudio");
    this.errorSound.src = errorAudio;
  },
  beforeUnmount() {
    clearInterval(this.timer);
    clearTimeout(this.errorTimer);
  },
  methods: {
    async initialze() {
      this.error = null;
      clearTimeout(this.errorTimer);

      this.errorSound.pause();
      this.errorSound.currentTime = 0;

      this.timer = setInterval(async () => {
        const now = new Date();
        let strTime = now.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        const temp = new Date(strTime);
        try {
          const res = await axios.get(
            `${this.api}${temp.getDate()}-${temp.getMonth() +
              1}-${temp.getFullYear()}`
          );
          const result = await this.processData(res.data, temp);

          if (!this.audio.paused && !result) {
            this.audio.pause();
            this.currentTime = 0;
            this.success = null;
          }

          this.log = [result, temp.toDateString(), temp.toLocaleTimeString()];
          this.data = res.data;
        } catch (err) {
          this.errorSound.play();
          this.stopServer();
          this.error = "Attempting to restart the server";
          this.errorTimer = setTimeout(async () => {
            await this.initialze();
          }, 5000);
        }
      }, 3000);
    },
    stopServer() {
      clearInterval(this.timer);
      this.timer = null;
      this.log = null;
      this.data = null;
      this.audio.pause();
      this.currentTime = 0;
      this.success = null;
    },
    async processData(res, now) {
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
                  "Date: " +
                  sessions[k].date +
                  "\n" +
                  "Center: " +
                  centers[j].name +
                  "\n" +
                  "Capacity: " +
                  sessions[k].available_capacity +
                  "\n" +
                  "Minimum Age: " +
                  sessions[k].min_age_limit +
                  "\n\n";
              }
            }
          }
        }
      }

      if (message) {
        this.audio.play();

        const users = await getUsers();
        const user = users[0];

        let flag = false;
        if (
          user.current === null ||
          (user.current &&
            new Date(now).getTime() - new Date(user.current).getTime() >
              300 * 1000) ||
          user.last !== message
        ) {
          await notifyBot(encodeURI(message));
          flag = true;
        }

        if (flag) {
          this.success = "Message sent";
          await updateCurrent(now, message);
        }

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
}

.log,
.error {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  text-align: center;
  color: whitesmoke;
}

.bg-chill {
  background: #1b9cfc;
}
</style>
