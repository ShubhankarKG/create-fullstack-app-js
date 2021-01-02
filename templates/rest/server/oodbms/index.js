const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connect = require("./config/dbconnect");

dotenv.config({ path: "config/config.env" });

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));

connect();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
