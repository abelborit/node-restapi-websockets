import { createServer } from "http";
import { envs } from "./config/envs.plugin";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { WebSocketServerService } from "./presentation/services/websocket-server.service";

const main = async () => {
  const server = new Server({
    port: envs.PORT,
    // routes: AppRoutes.routes,
  });

  /* la configuración que podemos mandar en createServer(.....) son básicamente las mismas que nosotros podemos tener en la aplicación de express "server.app" y son totalmente compatibles entre sí. Entonces ahora tenemos un servidor con la misma configuración que tenemos en el server de express */
  const httpServer = createServer(server.app);
  WebSocketServerService.initWebSocketServer({ server: httpServer }); // el path ya tiene el "/ws" como valor por defecto

  /* cuando trabajemos con nuestro servidor de sockets, es decir, con el "WebSocketServerService", para el momento en que empecemos a utilizarlo en las rutas "routes: AppRoutes.routes," el "WebSocketServerService" no está inicializado, veremos que cuando intentemos tomar esa instancia y la usemos nos dará el error de que el websocket server service no está inicializado, y eso es porque lo estamos inicializando después de que toda la aplicación de express ya está creada en -- const server = new Server(......) --, entonces de alguna manera tenemos que inicializar las rutas después de que el "WebSocketServerService" esté levantado porque luego de haber pasado ese momento entonces ya vamos a poder usar los sockets en nuestras rutas ya que las rutas dependen de la funcionalidad del servidor de websockets */
  server.setRoutes(AppRoutes.routes);

  /* este -- server.start(); -- es del servidor de express, pero nosotros queremos levantar el "httpServer" porque ese es el server que tiene la configuración del websocket */
  // server.start();
  httpServer.listen(envs.PORT, () => {
    console.log(`Server running on port ${envs.PORT} ✅`);
  });
};

(async () => {
  main();
})();
