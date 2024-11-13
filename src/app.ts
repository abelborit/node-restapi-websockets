import { envs } from "./config/envs.plugin";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

const main = async () => {
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
};

(async () => {
  main();
})();
