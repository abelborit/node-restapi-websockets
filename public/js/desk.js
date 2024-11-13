const lblPending = document.querySelector("#lbl-pending");
const deskHeader = document.querySelector("h1");
const noMoreAlert = document.querySelector(".alert");
const lblCurrentTicket = document.querySelector("small");
const btnDraw = document.querySelector("#btn-draw");
const btnDone = document.querySelector("#btn-done");

/* para tener los query parameters de la url */
const searchParams = new URLSearchParams(window.location.search);
// console.log({ searchParams });

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("parámetro 'escritorio' es requerido");
}

const deskNumber = searchParams.get("escritorio");
let workingTicket = null;

deskHeader.innerText = deskNumber;

function checkTicketCount(currentCount = 0) {
  // noMoreAlert.classList.toggle("d-none");
  if (currentCount === 0) {
    noMoreAlert.classList.remove("d-none");
  } else {
    noMoreAlert.classList.add("d-none");
  }

  lblPending.innerHTML = currentCount;
}

async function loadInitialCount() {
  const pendingTickets = await fetch("/api/ticket/pending").then((response) =>
    response.json()
  );

  checkTicketCount(pendingTickets.length);
}

async function getTicket() {
  const { status, ticket, message } = await fetch(
    `/api/ticket/draw/${deskNumber}`
  ).then((response) => response.json());

  if (status === "error") {
    lblCurrentTicket.innerText = message;
    return;
  }

  workingTicket = ticket;
  lblCurrentTicket.innerText = ticket.number;
}

function connectToWebSockets() {
  const socket = new WebSocket("ws://localhost:3000/ws");

  socket.onmessage = (event) => {
    // console.log(event.data); // nuestro evento es el "on-ticket-count-changed"

    const { type, payload } = JSON.parse(event.data);

    if (type !== "on-ticket-count-changed") {
      return `This is an unexpected type ${type}`;
    }

    checkTicketCount(payload);
  };

  socket.onclose = (event) => {
    console.log("Connection closed");
    setTimeout(() => {
      console.log("retrying to connect");
      connectToWebSockets();
    }, 1500);
  };

  socket.onopen = (event) => {
    console.log("Connected");
  };
}

/* Listeners */
btnDraw.addEventListener("click", getTicket);

/* Init functions */
loadInitialCount();
connectToWebSockets();
