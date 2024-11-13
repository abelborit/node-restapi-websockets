const currentTicketLbl = document.querySelector("span");
const createTicketBtn = document.querySelector("button");

const getLastTicket = async () => {
  const lastTicket = await fetch("/api/ticket/last").then((response) =>
    response.json()
  );
  // console.log({ lastTicket });

  currentTicketLbl.innerText = lastTicket;
};

const createTicket = async () => {
  const newTicket = await fetch("/api/ticket/create", { method: "POST" }).then(
    (response) => response.json()
  );
  // console.log(newTicket);

  currentTicketLbl.innerText = newTicket.number;
};

createTicketBtn.addEventListener("click", createTicket);

getLastTicket();
