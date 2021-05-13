<template>
  <div class="container">
    <div class="logs">
      <template v-if="log">
        <div :class="[log[0] ? 'bg-success' : 'bg-chill ', 'log display-4']">
          <div class="col-12">{{ log[1] }}</div>
          <div class="col-12">{{ log[2] }}</div>
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
      <button class="btn btn-outline-success" v-if="!timer" @click="initialze">
        Start Server
      </button>
      <button class="btn btn-outline-danger" v-else @click="stopServer">
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
import { getUsers, sendMail } from "../service";
import axios from "axios";

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
    async initialze() {
      this.error = null;
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

          const result = await this.processData(res.data);
          this.log = [result, temp.toDateString(), temp.toLocaleTimeString()];
          this.data = res.data;
        } catch (err) {
          this.error = "Check your connection";
          this.stopServer();
        }
      }, 3500);
    },
    stopServer() {
      clearInterval(this.timer);
      this.timer = null;
      this.log = null;
      this.data = null;
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
                  "<hr/>";
              }
            }
          }
        }
      }

      if (message) {
        message = "<hr/>" + message;
        this.audio.play();

        const users = await getUsers();

        users.forEach(async (user) => {
          await sendMail(
            user.email,
            message,
            "Vaccination Slots Available - Seoni"
          );
        });

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
