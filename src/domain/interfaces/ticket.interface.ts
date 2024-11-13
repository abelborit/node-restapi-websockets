export interface TicketInterface {
  id: string; // id del ticket
  number: number; // ticket 1 o ticket 2 ......
  createdAt: Date; // fecha en la que se creó
  handleAtDesk?: string; // escritorio 1 o escritorio 2 ......
  handleAt?: Date; // fecha en la que se empezó a trabajar
  done: boolean; // ticket realizado - finalizado
  // doneAt: Date; // fecha en la que se terminó
}
