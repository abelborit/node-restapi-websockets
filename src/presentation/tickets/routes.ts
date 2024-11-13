import { Router } from "express";
import { TicketController } from "./controller";

export class TicketsRoutes {
  static get routes() {
    const router = Router();
    const ticketController = new TicketController();

    router.get("/", ticketController.getAllTickets);
    router.get("/last", ticketController.getLastTicket);
    router.get("/pending", ticketController.pendingTickets);
    router.get("/working-on", ticketController.workingOnTicket); // este usaremos cuando se carga la pantalla la primera vez. Se puede hacer también que cuando nos conectemos al WebSocket Server se puede mandar toda la información que se necesita pero ahora lo haremos de tal forma para mantener la comunicación por websocket con lo mínimo necesario y cuando se necesite mandar la petición recién se ejecute (aunque todas las peticiones se podrían hacer por websocket pero aquí los utilizaremos solo para mantener la comunicación en tiempo real)

    router.post("/create", ticketController.createTicket);

    router.get("/draw/:desk", ticketController.drawTicket);
    router.put("/done/:ticketId", ticketController.doneTicket);

    return router;
  }
}
