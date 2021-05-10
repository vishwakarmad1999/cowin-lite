import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App";
import routes from "./routes";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount("#app");
