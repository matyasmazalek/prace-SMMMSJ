import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/index.jsx"), route("chat", "routes/chat.jsx")] satisfies RouteConfig;
