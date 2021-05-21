import axios from "axios";

const url = "/api/";
const BOT_TOKEN = "1753057580:AAGOXCKLoAlercB0i8r_xY8g_e8Gi040T7M";

export async function getUsers() {
  const users = await axios.get(`${url}users`);
  return users.data;
}

export async function createUser(email) {
  const users = await getUsers();

  for (let i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() == email.toLowerCase()) {
      return 400;
    }
  }

  return axios
    .post(`${url}create-user`, {
      email,
    })
    .then((res) => {
      return res.status;
    })
    .catch((err) => {
      return err.message;
    });
}

export async function updateCurrent(message) {
  return axios
    .put(`${url}update-current`, {
      message,
    })
    .then((res) => {
      return res.status;
    })
    .catch((err) => {
      return err.message;
    });
}

export async function sendMail(email, message, subject) {
  return axios
    .post(`${url}send`, {
      email,
      message,
      subject,
    })
    .then((res) => {
      return res.status;
    })
    .catch((err) => {
      return err.message;
    });
}

export async function sendAll(message, subject) {
  return axios
    .post(`${url}broadcast`, {
      message,
      subject,
    })
    .then((res) => {
      return res.status;
    })
    .catch((err) => {
      return err.message;
    });
}

export async function notifyBot(message) {
  const bot_url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=-573056182&text=${message}`;

  return axios
    .post(bot_url)
    .then((res) => res.status)
    .catch((err) => err.message);
}
