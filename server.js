const http = require("http");

const app = require("./backend/app");

// const PORT = process.env.PORT || 3000;

// const server = http.createServer(app);

// server.listen(PORT, () => {
//   console.log(`http://localhost:${PORT}`);
// });

const normalizedPort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const port = normalizedPort(process.env.PORT || 3000);
app.set("port", port);

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${[port]}` : `Port ${port}`;

  // Handle specific errors
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe" + addr : "port " + port;
  console.log("Listening on " + bind);
};

const server = http.createServer(app);

server.on("error", onError);
server.on("listening", onListening);

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
