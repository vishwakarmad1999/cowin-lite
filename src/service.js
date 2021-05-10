import axios from "axios";

const url = "/api/";

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

export async function sendMail(email, message) {
  return axios
    .post(`${url}sendMail`, {
      email,
      message,
    })
    .then((res) => {
      return res.status;
    })
    .catch((err) => {
      return err.message;
    });
}
