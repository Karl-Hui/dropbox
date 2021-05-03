// require modules
const fs = require("fs"); // inbuilt
const express = require("express"); // need to download
const fileUpload = require("express-fileupload"); // need to download
const { request } = require("http");
const { response } = require("express");
const { rejects } = require("assert");
const path = require("path"); //inbuilt
const port = 8000;
const cors = require("cors");

//setup module
const app = express();
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/upload"));
app.use(fileUpload());
app.use(cors());

let uploadDirectory = __dirname + "/upload/";
let caches = [];

let newWriteFile = function (fileName, fileData) {
  return new Promise((resolve, reject) => {
    fs.writeFile(uploadDirectory + fileName, fileData, (err) => {
      if (err) {
        console.log("write Error");
        reject(err);
      } else {
        resolve(fileData);
      }
    });
  });
};

let newReadFile = function (fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/" + fileName, (err, data) => {
      if (err) {
        console.log("Read File Error: ", err);
        reject("Read File Error: ", err);
      } else {
        resolve(data);
      }
    });
  }).catch((err) => {
    console.log("catch error", err);
  });
};

app.get("/", (request, response) => {
  response.sendFile("index.html");
});

app.get("/upload/:name", (request, response) => {
  // const directory = __dirname + "/upload/" + request.params.name;
  console.log(request.params.name);
  response.send(
    `<a href="http://localhost:${port}/${request.params.name}" download="${request.params.name}"> DOWNLOAD </a>`
  );
});

app.get("/upload/:name", (request, response) => {
  let directory = __dirname + "/upload/" + request.params.name;
  console.log(request.params.name);
  response.sendFile(directory);
});

app.post("/files", (request, response) => {
  let file = request.files.dropboxFile;
  let fileName = request.files.dropboxFile.name;
  console.log(fileName);

  let fileInfo = {};

  if (file instanceof Array) {
    for (let i = 0; i < file.length; i++) {
      let fileName = file[i].name;
      let fileData = file[i].data;
      caches[fileName] = newWriteFile(fileName, fileData);
      response.write(`<p>${fileName}</p>`);
    }
    response.end();
  } else {
    // console.log(file);
    let fileName = file.name;
    let fileType = file.mimetype;
    // console.log(fileName, fileType);

    let beverly = {
      fileName: file.name,
      fileType: file.mimetype,
    };
    newReadFile("test.json").then((data) => {
      let student = JSON.parse(data);
      student.userInfo.push(beverly);
      let str = JSON.stringify(student);
      fs.writeFile(__dirname + "/test.json", str, function (err) {
        if (err) {
          console.log(err);
        }
        console.log("add new user to userINfo");
      });
    });

    // let rawdata = fs.readFileSync(__dirname + "/test.json");
    // let student = JSON.parse(rawdata);
    // console.log(student);

    // console.log("got herer?");
    // newWriteFile(fileName, fileData).then(() => {
    //   //   // console.log(data);

    //   fileInfo.files.push({
    //     name: fileName,
    //   });
    //   console.log("checking", fileInfo.files);

    //   let stringCaches = JSON.stringify(fileInfo.files);
    //   //   // // console.log("stringFy: ", typeof stringCaches);
    //   fs.writeFile("test.json", stringCaches, (err) => {
    //     if (err) throw err;
    //     console.log("Data written to file");
    //   });
    //   response.end();
    // });
    response.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
