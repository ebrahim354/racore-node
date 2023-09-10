const express = require("express");
const App = express();

const { S3Client, GetObjectCommand, HeadObjectCommand, GetObjectTaggingCommand } = require('@aws-sdk/client-s3');
const s3 = new S3Client();
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
const { BUCKET } = require("./utils/config");

App.use(express.static(path.join(__dirname, "..")));
App.use(express.json());
App.use(morgan("tiny"));
App.use(helmet());
App.use(cors());

App.get("/", (_, res) => {
  console.log("HI\n");
  return res.send("hello");
});

App.use(getToken);
App.use("/api/verifyToken", verification);
App.use("/api/auth/", auth);
App.use("/api/products", products);
App.use("/api/orders", orders);

App.get("*", async (req, res) => {
  let filename = req.path.slice(1);
  const params = {
    Bucket: BUCKET,
    Key: filename
  }
  try {
     const headResponse = await s3.send(new HeadObjectCommand(params));
     console.log('res- ', headResponse);
        res.set({
            "Content-Length": headResponse.ContentLength,
            "Content-Type": headResponse.ContentType,
            "ETag": headResponse.ETag,
        });
   const response = await s3.send(new GetObjectCommand(params));
        const stream = response.Body;
        stream.on("data", (chunk) => res.write(chunk));
        stream.once("end", () => {
            res.end();
        });
        stream.once("error", () => {
            res.end();
        });
  } catch (error) {
    if (error.code === "NoSuchKey") {
      console.log(`No such key ${filename}`);
      res.sendStatus(404).end();
    } else {
      console.log(error);
      res.sendStatus(500).end();
    }
  }
});

App.use(errorHandler);

module.exports = App;
