const lblPending = document.querySelector("#lbl-pending");

async function loadInitialCount() {
  const pendingTickets = await fetch("/api/ticket/pending").then((response) =>
    response.json()
  );

  lblPending.innerHTML = pendingTickets.length || 0;
}

function connectToWebSockets() {
  const socket = new WebSocket("ws://localhost:3000/ws");

  socket.onmessage = (event) => {
    // console.log(event.data); // nuestro evento es el "on-ticket-count-changed"

    const { type, payload } = JSON.parse(event.data);

    if (type !== "on-ticket-count-changed") {
      return `This is an unexpected type ${type}`;
    }

    lblPending.innerHTML = payload;
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

loadInitialCount();
connectToWebSockets();
