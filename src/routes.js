import Home from "./components/Home";
import Server from "./components/Server";
import Support from "./components/Support";
import About from "./components/About";

const routes = [
  { path: "/", redirect: "home" },
  { path: "/home", component: Home },
  { path: "/support", component: Support },
  { path: "/about", component: About },
  { path: "/admin", component: Server },
];

export default routes;
