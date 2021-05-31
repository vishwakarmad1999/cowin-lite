import axios from "axios";

const url = "/api/";
const BOT_TOKEN = "1753057580:AAGOXCKLoAlercB0i8r_xY8g_e8Gi040T7M";

export async function getUsers() {
  const users = await axios.get(`${url}users`);
  return users.data;
}

export async function updateCurrent(message, last) {
  return axios
    .put(`${url}update-current`, {
      message,
      last,
    })
    .then((res) => {
      return res.status;
    })
    .catch((err) => {
      return err.message;
    });
}

export async function notifyBot(message) {
  const bot_url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=-1001436114329&text=${message}`;

  return axios
    .post(bot_url)
    .then((res) => res.status)
    .catch((err) => err.message);
}
