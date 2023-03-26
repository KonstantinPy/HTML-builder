const path = require("path");
const fs = require("fs");
const {dir} = require("console");
const fsPromises = fs.promises;
const way = path.resolve(__dirname, "styles");
const copyWay = path.resolve(__dirname, "project-dist", "bundle.css");

fs.writeFile(copyWay, "", (err) => {
  if (err) throw err;
});

const readFile = async (dirName) => {
  const readDir = await fsPromises.readdir(dirName, {withFileTypes: true});

  for (item of readDir) {
    if (item.isDirectory()) {
      const filesWithin = path.resolve(dirName, item.name);
      return readFile(filesWithin);
    } else {
      if (path.extname(item.name) === ".css") {
        fs.readFile(path.resolve(dirName, item.name), (err, data) => {
          if (err) throw err;
          fsPromises.appendFile(copyWay, data);
        });
      }
    }
  }
};

const getStyles = async () => {
  try {
    const dirents = await fsPromises.readdir(way, {
      withFileTypes: true,
    });
    await Promise.all(
      dirents.map((dirent) => {
        if (dirent.isDirectory()) {
          const entireFolderPath = path.resolve(way, dirent.name);
          readFile(entireFolderPath);
        } else {
          if (path.extname(dirent.name) === ".css") {
            fs.readFile(path.resolve(way, dirent.name), (err, data) => {
              if (err) throw err;
              fsPromises.appendFile(copyWay, data);
            });
          }
        }
      })
    );
  } catch (error) {
    console.error(error);
  }
};
getStyles();

// //Варианты без проработки вложенности:

// const getFiles = async (dirName) => {
//   const dirents = await fsPromises.readdir(dirName, {withFileTypes: true});

//   const files = await Promise.all(
//     dirents.map((dirent) => {
//       if (dirent.isDirectory()) {
//         const entireFolderPath = path.resolve(dirName, dirent.name);
//         return getFiles(entireFolderPath);
//       }

//       const extInfo = path.extname(dirent.name) === ".css";
//       return extInfo && dirent;
//     })
//   );
//   return Array.prototype.concat(...files).filter(Boolean);
// };

// const getStyles = async () => {
//   try {
//     const files = await getFiles(way);
//     const writeStream = fs.createWriteStream(copyWay);
//     for (file of files) {
//       const filePath = path.resolve(way, file.name);
//       const readStream = fs.createReadStream(filePath, {encoding: "utf-8"});
//       readStream.pipe(writeStream);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
// getStyles();

// const getFiles = async () => {
//   try {
//     const dirents = await fsPromises.readdir(way, {withFileTypes: true});

//     for (i = 0; i < dirents.length; i++) {
//       console.log(dirents[i].name);
//       if (
//         dirents[i].isFile() &&
//         path.extname(dirents[i].name).slice(1) === "css"
//       ) {
//         console.log(`есть совпандение ${dirents[i].name}!`);
//         fs.readFile(
//           path.resolve(way, dirents[i].name),
//           "utf-8",
//           (err, data) => {
//             if (err) return console.error(err);

//             fs.appendFile(path.resolve(copyWay), data, (err) => {
//               if (err) throw err;
//             });
//           }
//         );
//       }
//     }
//   } catch (error) {
//       console.log(error);
//   }
// };
// getFiles();
