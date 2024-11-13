import { Request, Response } from "express";

export class TicketController {
  /* aquí haremos la inyección de dependencias de nuestro "WebSocketServerService" porque nuestro retfull API usará información de ese servicio para poder mandar comunicación por websockets a través del restfull API */
  constructor() {}

  public getAllTickets = async (request: Request, response: Response) => {
    response.json("getTickets");
  };

  public getLastTicket = async (request: Request, response: Response) => {
    response.json("getLastTicket");
  };

  public pendingTickets = async (request: Request, response: Response) => {
    response.json("pendingTickets");
  };

  public workingOnTicket = async (request: Request, response: Response) => {
    response.json("workingOnTicket");
  };

  public createTicket = async (request: Request, response: Response) => {
    response.json("createTicket");
  };

  public drawTicket = async (request: Request, response: Response) => {
    response.json("drawTicket");
  };

  public doneTicket = async (request: Request, response: Response) => {
    response.json("doneTicket");
  };
}
