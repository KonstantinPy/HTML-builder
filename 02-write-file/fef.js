
const fs = require("fs");
const process = require("process");
const path = require("path");
const {stdin, stdout} = process;

let writeableStream = fs.createWriteStream(path.join(__dirname, "mynotes.txt"));
console.log("Пожалуйста, введите текст");

stdin.on("data", (data) => {
  if (data.toString().trim() == "exit") {
    console.log("Вы ввели команду выхода. До встречи!");
    process.exit();
  }
  console.log("Пожалуйста, введите текст");
  writeableStream.write(data);
});
