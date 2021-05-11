import Registration from "./components/Registration";
import Server from "./components/Server";

const routes = [
  { path: "/", redirect: "home" },
  { path: "/home", component: Registration },
  { path: "/admin", component: Server },
];

export default routes;
