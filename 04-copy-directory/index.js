const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;
const way = path.resolve(__dirname, "files");
const copyWay = path.resolve(__dirname, "files-copy");

fs.mkdir(copyWay, {recursive: true}, (err) => {
  if (err) throw err;
});

const copyFiles = async () => {
  try {
    const copies = await fsPromises.readdir(copyWay, {withFileTypes: true});
    console.log(copies);
    // for (let i = 0; i < copies.length; i++) {
    //   fs.unlink(path.resolve(copyWay, copies[i].name), (err) => {
    //     if (err) return console.error(err);
    //     console.log(`Файл ${copies[i].name} удален!`);
    //   });
    // }
    for (copie of copies) {
      fs.unlink(path.resolve(copyWay, copie.name), (err) => {
        if (err) return console.error(err);
      });
      console.log(`Файл ${copie.name} удален!`);
    }

    const items = await fsPromises.readdir(way, {withFileTypes: true});
    console.log(items);
    for (item of items) {
      if (item.isFile()) {
        fs.copyFile(
          path.resolve(way, item.name),
          path.resolve(copyWay, item.name),
          (err) => {
            if (err) return console.error(err);
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};
copyFiles();

