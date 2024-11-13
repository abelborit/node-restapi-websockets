/* se pudo haber creado también como un "websocket-server.ts" pero ese websocket server lo vamos a colocar en algunas rutas que vamos a crear en el servidor rest, porque eventualmente vamos a tener, por ejemplo, una ruta -- /api/ticket/create -- y entonces al enviar la petición vamos a crear un nuevo ticket pero a la vez una pantalla estará pendiente cuando se crea un nuevo ticket y automáticamente mediante sockets va a colocar el valor de ese último ticket. Entonces de alguna manera vamos a tener que conectar nuestro websocket server con nuestro servidor de express y por eso lo haremos mediante un servicio para poder compartir esa información */

/* usaremos un "External HTTP/S server" porque vamos a querer poder recibir peticiones HTTP y responder enviando un get, post, put y delete */
import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

interface ServerOptions {
  server: Server;
  path?: string; // será el path del servidor, es decir, será el path que dirá dónde queremos que nuestros websockets se conecten
}

/* aqui lo manejaremos como un singleton porque solo necesitamos una sola instancia de nuestro websocket server */
/* aquí lo que queremos hacer es conectar express con nuestro websocket server en el mismo servidor teniendo las configuraciones necesarias para estar escuchando nuestros sockets y la idea es que podamos usar este servicio de "WebSocketServerService" para lanzar las peticiones y mensajes que queremos usando el servicio como tal de "WebSocketServerService" en cualquier lado de nuestra aplicación y simplemente al tomar esa instancia entonces ya vamos a tener acceso a todo el websocket server en cualquier parte de nuestra aplicación */
export class WebSocketServerService {
  /* aquí es donde vamos a almacenar la instancia inicializada */
  private static _instance: WebSocketServerService;
  private wss: WebSocketServer; // tiene los clientes, las formas para enviar los mensajes, etc del package "ws"

  private constructor(serverOptions: ServerOptions) {
    const { server, path = "/ws" } = serverOptions; // por defecto el path sería como -- localhost:3000/ws --

    /* la propiedades readonly solo se pueden modificar en el constructor, ya después no se puede */
    this.wss = new WebSocketServer({
      server,
      path,
    });

    this.start(); // para que esté escuchando las conexiones
  }

  /* obtener la instancia de nuestro servidor y si lo usamos en alguna implementación podremos saber si el servidor ya estaba inicializado, si está inicializada la instancia, etc. Aquí vamos a tener la instancia del servidor */
  static get instance(): WebSocketServerService {
    if (!WebSocketServerService._instance) {
      throw "WebSocketServerService is not initialized";
    }

    return WebSocketServerService._instance;
  }

  /* se está creando de esta forma y no mandando a llamar al constructor, porque como lo vamos a mandar a inicializar una única vez y luego en todos los lugares vamos a apuntar al WebSocketServerService y al _instance pero la _instance como es privada tenemos que crear algún getter para poderla obtener, estamos creando el -- static get instance() -- */
  static initWebSocketServer(serverOptions: ServerOptions) {
    WebSocketServerService._instance = new WebSocketServerService(
      serverOptions
    );
  }

  /* para enviarle un mensaje (todo lo que queremos enviar, en este caso el type y el payload) a todos los clientes que estén conectados a nuestro websocket. Estamos haciendo un "Server broadcast" */
  public sendMessage(type: string, payload: Object) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type, payload }));
      }
    });
  }

  public start() {
    /* si vamos a usar el tipado de -- ws: WebSocket -- tenemos que importar el WebSocket del package "ws" porque si no entonces va a utilizar el WebSocket nativo y por ende su implementación navita de los WebSockets y tendrá entonces otros métodos y propiedades que no son enteramente compatibles con lo que estamos recibiendo de "ws" en el -- (ws: WebSocket) -- */
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("Client connected");

      ws.on("close", () => {
        console.log("Client disconnected");
      });
    });
  }
}
