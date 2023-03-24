// const path = require("path");
// const fs = require("fs");
// const way = path.join(__dirname, "secret-folder");

// fs.readdir(way, {withFileTypes: true}, (err, data) => {
//   if (err) throw err;
//   for (let i = 0; i < data.length; i++) {
//     if (data[i].isFile() === true) {
//       fs.stat(path.resolve(way, `${data[i].name}`), (error, stats) => {
//         if (err) throw err;
//         console.log(
//           `${data[i].name.split(".").slice(0, -1)} - ${path
//             .extname(data[i].name)
//             .slice(1)} - ${stats.size / 1024}kb`
//         );
//       });
//     }
//   }
// });

const path = require("path");
const fsPromises = require("fs").promises;
const way = path.join(__dirname, "secret-folder");

const getFiles = async (way) => {
  const dirents = await fsPromises.readdir(way, {withFileTypes: true});

  const files = await Promise.all(
    dirents.map((dirent) => {
      if (dirent.isDirectory()) {
        return;
      }
      return dirent;
    })
  );

  return Array.prototype.concat(...files).filter(Boolean);
};

getFiles(way).then(async (dirents) => {
  for (const dirent of dirents) {
    const checkPath = path.resolve(way, dirent.name);
    const {name, ext} = path.parse(checkPath);
    const {size: fileSize} = await fsPromises.stat(checkPath);

    console.log(`${name} - ${ext.slice(1)} - ${fileSize / 1024}Kb`);
  }
});
