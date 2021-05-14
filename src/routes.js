import Home from "./components/Home";
import Server from "./components/Server";
import Support from "./components/Support";

const routes = [
  { path: "/", redirect: "home" },
  { path: "/home", component: Home },
  { path: "/support", component: Support },
  { path: "/admin", component: Server },
];

export default routes;
