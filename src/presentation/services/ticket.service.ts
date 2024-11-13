import { UuidAdapter } from "../../config/uuid.adapter";
import { TicketInterface } from "../../domain/interfaces/ticket.interface";

export class TicketService {
  private readonly tickets: TicketInterface[] = [
    /* como queremos que nuestro backend le asigne el id a los tickets (para que no lo asigne el lado cliente - frontend) haremos uso del "uuid" package */
    { id: UuidAdapter.uuidv4(), number: 1, createdAt: new Date(), done: false },
    { id: UuidAdapter.uuidv4(), number: 2, createdAt: new Date(), done: false },
    { id: UuidAdapter.uuidv4(), number: 3, createdAt: new Date(), done: false },
    { id: UuidAdapter.uuidv4(), number: 4, createdAt: new Date(), done: false },
    { id: UuidAdapter.uuidv4(), number: 5, createdAt: new Date(), done: false },
    { id: UuidAdapter.uuidv4(), number: 6, createdAt: new Date(), done: false },
  ];
}
