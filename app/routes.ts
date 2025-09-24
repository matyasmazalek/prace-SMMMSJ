import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.jsx"),
  route("chat/:id", "routes/chat.$id.jsx"),
] satisfies RouteConfig;
