import { Request, Response } from "express";
import { TicketService } from "../services/ticket.service";

export class TicketController {
  /* aquí haremos la inyección de dependencias de nuestro "WebSocketServerService" porque nuestro retfull API usará información de ese servicio para poder mandar comunicación por websockets a través del restfull API */
  constructor(private readonly ticketService = new TicketService()) {}

  public getAllTickets = async (request: Request, response: Response) => {
    response.status(200).json(this.ticketService.tickets);
  };

  public getLastTicket = async (request: Request, response: Response) => {
    response.status(200).json(this.ticketService.lastTicket);
  };

  public pendingTickets = async (request: Request, response: Response) => {
    response.status(200).json(this.ticketService.pendingTickets);
  };

  public workingOnTicket = async (request: Request, response: Response) => {
    response.status(200).json(this.ticketService.lastWorkingOnTickets);
  };

  public createTicket = async (request: Request, response: Response) => {
    response.status(201).json(this.ticketService.createTicket());
  };

  public drawTicket = async (request: Request, response: Response) => {
    const { desk } = request.params;

    response.status(200).json(this.ticketService.drawTicket(desk));
  };

  public doneTicket = async (request: Request, response: Response) => {
    const { ticketId } = request.params;

    response.status(200).json(this.ticketService.finishedTicket(ticketId));
  };
}
