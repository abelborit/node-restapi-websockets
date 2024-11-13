/* todo lo que va de express usualmente se coloca en la carpeta de presentation para no afectar la lógica de negocio. Aquí se podría decir que es una dependencia oculta pero en realidad se va a utilizar express en muy pocos archivos y por eso se puede colocar normal en los archivos donde haga falta */
import express, { Router } from "express";
import path from "path"; // este "path" ya viene nativo en node para trabajar con rutas de archivos y directorios. Aquí se utiliza para generar rutas absolutas

interface ServerOptions {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {
  /* inicializar express */
  /* lo cambiamos a public readonly para que al probar en nuestro test nos aparezca también la inicialización de express (la variable app) y no solo los métodos de la clase Server */
  public readonly app = express();

  /* opcional porque en algún punto en el tiempo no va a tener un valor, porque hasta que se levanta el servidor recién lo tendrá. Tiene de tipo any solo para no hacerlo más complicado, pero se podría buscar el tipo correcto */
  private serverListener?: any;

  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(serverOptions: ServerOptions) {
    const { port, public_path = "public", routes } = serverOptions;

    /* la propiedades readonly solo se pueden modificar en el constructor, ya después no se puede */
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;

    this.configure();
  }

  /* se está separando la lógica de los middlewares y demás porque como no estamos usando el método start de esta clase server, porque ya estamos mandando a llamar al listen del httpServer que creamos en "app.ts", entonces estamos separando esa lógica para que se llame por separado y lo mandamos a llamar en el constructor para que cuando se cree esta clase entonces se mande a llamar también este método configure() sin la necesidad de mandar a llamar al método start() porque no lo necesitamos ahora */
  private configure() {
    //* Middlewares
    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

    //* Public Folder
    this.app.use(express.static(this.publicPath));

    //* Routes
    this.app.use(this.routes);

    //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api nos va a reponder nuestro index.html porque si empieza con api entonces quiere decir que es alguna de nuestras rutas
    this.app.get(/^\/(?!api).*/, (req, res) => {
      const indexPath = path.join(
        __dirname + `../../../${this.publicPath}/index.html`
      );
      res.sendFile(indexPath);
    });
  }

  async start() {
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port} ✅`);
    });
  }

  public close() {
    /* aquí no aparecerá el autocompletado del .close() porque como arriba se puso de tipo any entonces puede ser cualquier valor */
    this.serverListener?.close();
  }
}
