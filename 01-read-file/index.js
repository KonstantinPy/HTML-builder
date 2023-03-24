const path = require("path");
const fs = require("fs");

const way = path.resolve(__dirname, "text.txt");
const content = fs.createReadStream(way, "utf-8");
let acum = "";
content.on("data", (data) => (acum += data));
content.on("end", () => console.log(acum));
content.on("error", (error) => console.error(error));
