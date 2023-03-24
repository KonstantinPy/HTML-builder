const fs = require("fs");
const path = require("path");
const {stdin, stdout} = process;

const way = path.resolve(__dirname, "notes.txt");
const output = fs.createWriteStream(way, "utf-8");
console.log("Привет, введи текст!");

stdin.on("data", (chunk) => {
  if (chunk.toString().trim() == "exit") {
    process.exit();
  } else {
    console.log("Привет, введи текст!");
    output.write(chunk);
  }
});
process.on("exit", () => console.log("Удачи"));

process.stdin.resume();

process.on("SIGINT", () => {
  process.exit();
});
