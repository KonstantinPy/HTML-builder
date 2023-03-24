const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const {stdin, stdout} = process;
const way = path.resolve(__dirname, "notes.txt");

const checkAcckess = async (way) => {
  try {
    await fsPromises.access(way, fs.constants.R_OK | fs.constants.W_OK);
  } catch (error) {
    const EMPTY_CONTENT = "";
    await fsPromises.writeFile(way, EMPTY_CONTENT, {encoding: "utf-8"});
  }
  return way;
};

checkAcckess(way).then((correctWay) => {
  stdout.write("Привет, введи текст! \n");

  stdin.on("data", (data) => {
    const dataText = Buffer.from(data, "utf-8").toString();
    if (dataText.trim() == "exit") {
      process.exit();
    }
    stdout.write("Привет, введи текст! \n");

    fsPromises.appendFile(correctWay, dataText, {encoding: "utf-8"});
  });
  process.on("exit", () => stdout.write("Удачи"));

  process.stdin.resume();
  process.on("SIGINT", () => {
    process.exit();
  });
});

// const fs = require("fs");
// const path = require("path");
// const {stdin, stdout} = process;

// const way = path.resolve(__dirname, "notes.txt");
// const output = fs.createWriteStream(way, "utf-8");
// console.log("Привет, введи текст!");

// stdin.on("data", (chunk) => {
//   if (chunk.toString().trim() == "exit") {
//     process.exit();
//   } else {
//     console.log("Привет, введи текст!");
//     output.write(chunk);
//   }
// });
// process.on("exit", () => console.log("Удачи"));

// process.stdin.resume();

// process.on("SIGINT", () => {
//   process.exit();
// });
