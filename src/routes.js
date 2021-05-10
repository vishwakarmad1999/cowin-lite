import Registration from "./components/Registration";
import Server from "./components/Server";

const routes = [
  { path: "/", redirect: "home" },
  { path: "/home", component: Registration },
  { path: "/master_admin0987654321", component: Server },
];

export default routes;
