import { Router } from "express";

export class AppRoutes {
  /* aquí se utiliza static functions porque como no se hará inyección de dependencias entonces no sería necesario instanciar la clase AppRoutes y solo se coloca directo. También se están usando el get function para tener otra forma de realizar esta función, se podría realizar sin ese get (son solo diferentes formas de hacerlo) */
  static get routes(): Router {
    const router = Router();

    /* Routes de las API */
    // router.use('/api/todos', /*TodoRoutes.routes */ );

    return router;
  }
}
