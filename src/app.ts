import { createServer } from "http";
import { envs } from "./config/envs.plugin";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { WebSocketServerService } from "./presentation/services/websocket-server.service";

const main = async () => {
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  /* la configuración que podemos mandar en createServer(.....) son básicamente las mismas que nosotros podemos tener en la aplicación de express "server.app" y son totalmente compatibles entre sí. Entonces ahora tenemos un servidor con la misma configuración que tenemos en el server de express */
  const httpServer = createServer(server.app);
  WebSocketServerService.initWebSocketServer({ server: httpServer }); // el path ya tiene el "/ws" como valor por defecto

  /* este -- server.start(); -- es del servidor de express, pero nosotros queremos levantar el "httpServer" porque ese es el server que tiene la configuración del websocket */
  // server.start();
  httpServer.listen(envs.PORT, () => {
    console.log(`Server running on port ${envs.PORT} ✅`);
  });
};

(async () => {
  main();
})();
