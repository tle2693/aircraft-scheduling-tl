const jsonServer = require("json-server");
const middleWare = jsonServer.defaults();
const server = jsonServer.create();

server.use(middleWare);
server.use(jsonServer.bodyParser);

const response = require("../server/response");

server.get("/api/aircrafts", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.status(200).send(response.airCrafts);
});

server.get("/api/flights", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.status(200).send(response.flights);
});

server.listen(3000, () => {
  console.log("JSON Server listening on port 3000");
});
