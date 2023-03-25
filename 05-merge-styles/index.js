const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;
const way = path.resolve(__dirname, "styles");
const copyWay = path.resolve(__dirname, "project-dist", "bundle.css");

fs.writeFile(
    copyWay,
    '',
    (err) => {
      if (err) throw err;
    });


const getFiles = async () => {
  try {
    const dirents = await fsPromises.readdir(way, {withFileTypes: true});

    for (i = 0; i < dirents.length; i++) {
      console.log(dirents[i].name);
      if (
        dirents[i].isFile() &&
        path.extname(dirents[i].name).slice(1) === "css"
      ) {
        console.log(`есть совпандение ${dirents[i].name}!`);
        fs.readFile(
          path.resolve(way, dirents[i].name),
          "utf-8",
          (err, data) => {
            if (err) return console.error(err);

            fs.appendFile(path.resolve(copyWay), data, (err) => {
              if (err) throw err;
            });
          }
        );
      }
    }
  } catch (error) {
      console.log(error);
  }
};
getFiles();

