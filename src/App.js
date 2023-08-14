const express = require("express");
const App = express();
//packages
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
// routes
const products = require("./routes/products");
const orders = require("./routes/orders");
const auth = require("./routes/auth");
const verification = require("./routes/verifyTokenRoute");
// utils
const getToken = require("./middleware/getToken");
const errorHandler = require("./middleware/errorHandler");

App.use(express.static(path.join(__dirname, "..")));
App.use(express.json());
App.use(morgan("tiny"));
App.use(helmet());
App.use(cors());

App.get("/", (_, res) => {
  return res.send("hello");
});
App.use(getToken);
App.use("/api/verifyToken", verification);
App.use("/api/auth/", auth);
App.use("/api/products", products);
App.use("/api/orders", orders);

App.use(errorHandler);

module.exports = App;
