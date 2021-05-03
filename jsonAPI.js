const { request, response } = require("express");
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/test.json");
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
