// require modules
const fs = require("fs");
const express = require("express");
const fileUpload = require("express-fileupload");
const { request } = require("http");
const { response } = require("express");
const port = 3000;

//setup module
const app = express();
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/upload"));
app.use(fileUpload());

app.get("/", (request, response) => {
  response.sendFile("index.html");
});

app.get("/upload/:name", (request, response) => {
  const directory = __dirname + "/upload/" + request.params.name;
  console.log(request.params.name);
  response.sendFile(directory);
});

app.post("/files", (request, response) => {
  const fileName = request.files.dropboxFile.name;
  const fileData = request.files.dropboxFile.data;
  const directory = __dirname + "/upload/";
  console.log(fileName, fileData);
  console.log(directory + fileName);
  fs.writeFile(directory + fileName, fileData, (err) => {
    if (err) {
      console.log("Error: ", err);
    }
  });
  response.end();
});

app.listen(3000, () => {
  console.log(`listening to port ${port}`);
});
