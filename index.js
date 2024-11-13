const express = require("express");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3001;

const db = require("./utils/dbUtils");
app.use(express.json());

const swaggerDocument = require("./utils/swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//-testing endpoint-//
app.get("/", (req, res) => {
  res.send("Welcome");
});
//--//

//-app routes-//
const authRoute = require("./routes/authRoutes");
const taskRoute = require("./routes/taskRoute");
app.use("/", authRoute);
app.use("/", taskRoute);
//--//

//-global error handler-//
const error = async function (err, req, res, next) {
  if (err.status) {
    console.log(err);
    res.status(err.status).send({ Error: err.message });
  } else {
    console.log(err);
    res.status(500).send({ Error: err.message });
  }
};

app.use(error);
//--//

//-handle database connection-//
db.connectDb();
process.on("SIGINT", () => {
  console.log("Closing server");
  db.disconnectDB();
  process.exit();
});

process.on("exit", () => {
  console.log("Server closed");
});
//--//

app.listen(PORT, () => {
  console.log(`listening on port:${PORT}`);
});
