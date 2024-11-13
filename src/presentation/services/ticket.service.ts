import { UuidAdapter } from "../../config/uuid.adapter";
import { TicketInterface } from "../../domain/interfaces/ticket.interface";
import { WebSocketServerService } from "./websocket-server.service";

export class TicketService {
  constructor(
    private readonly webSocketServerService = WebSocketServerService.instance
  ) {}

  public readonly tickets: TicketInterface[] = [
    /* como queremos que nuestro backend le asigne el id a los tickets (para que no lo asigne el lado cliente - frontend) haremos uso del "uuid" package */
    { id: UuidAdapter.uuidv4(), number: 1, createdAt: new Date(), done: false },
    { id: UuidAdapter.uuidv4(), number: 2, createdAt: new Date(), done: false },
    { id: UuidAdapter.uuidv4(), number: 3, createdAt: new Date(), done: false },
    { id: UuidAdapter.uuidv4(), number: 4, createdAt: new Date(), done: false },
    { id: UuidAdapter.uuidv4(), number: 5, createdAt: new Date(), done: false },
    { id: UuidAdapter.uuidv4(), number: 6, createdAt: new Date(), done: false },
  ];

  /* será los tickets en los cuales estamos trabajando actualmente en la pantalla (son los que serán desde la pantalla del cliente y lo manejaremos que tengo 4 tickets) */
  private readonly workingOnTickets: TicketInterface[] = [];

  public get pendingTickets(): TicketInterface[] {
    return this.tickets.filter((ticket) => !ticket.handleAtDesk);
  }

  public get lastWorkingOnTickets(): TicketInterface[] {
    return this.workingOnTickets.slice(0, 4);
  }

  public get lastTicket(): number {
    /* se coloca el -- !.number -- porque ya hicimos la validación de que sí hay o no hay tickets */
    return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0;
  }

  public createTicket() {
    const ticket: TicketInterface = {
      id: UuidAdapter.uuidv4(),
      number: this.lastTicket + 1,
      // number: this.tickets.length + 1,
      createdAt: new Date(),
      handleAtDesk: undefined,
      handleAt: undefined,
      done: false,
    };

    this.tickets.push(ticket);
    this.onTicketNumberChanged();

    return ticket;
  }

  public drawTicket(desk: string) {
    const ticket = this.tickets.find(
      (ticketElement) => !ticketElement.handleAtDesk
    );

    if (!ticket) {
      return { status: "Error", message: "There aren't pending tickets" };
    }

    ticket.handleAtDesk = desk;
    ticket.handleAt = new Date();

    this.workingOnTickets.unshift({ ...ticket });

    return { status: "ok", ticket: ticket };
  }

  public finishedTicket(id: string) {
    const ticket = this.tickets.find(
      (ticketElement) => ticketElement.id === id
    );

    if (!ticket) {
      return { status: "Error", message: "Ticket don't find" };
    }

    this.tickets.map((ticketElement) => {
      if (ticketElement.id === id) {
        ticket.done = true;
      }

      return ticket;
    });

    return { status: "ok", ticket: ticket };
  }

  private onTicketNumberChanged() {
    this.webSocketServerService.sendMessage(
      "on-ticket-count-changed",
      this.pendingTickets.length
    );
  }
}
