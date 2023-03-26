// const path = require("path");
// const fs = require("fs");
// const fsPromises = fs.promises;
// const way = path.resolve(__dirname, "files");
// const copyWay = path.resolve(__dirname, "files-copy");

// fs.mkdir(copyWay, {recursive: true}, (err) => {
//   if (err) throw err;
// });

// const copyFiles = async () => {
//   try {
//     const copies = await fsPromises.readdir(copyWay, {withFileTypes: true});
//     console.log(copies);
//     // for (let i = 0; i < copies.length; i++) {
//     //   fs.unlink(path.resolve(copyWay, copies[i].name), (err) => {
//     //     if (err) return console.error(err);
//     //     console.log(`Файл ${copies[i].name} удален!`);
//     //   });
//     // }
//     for (copie of copies) {
//       fs.unlink(path.resolve(copyWay, copie.name), (err) => {
//         if (err) return console.error(err);
//       });
//       console.log(`Файл ${copie.name} удален!`);
//     }

//     const items = await fsPromises.readdir(way, {withFileTypes: true});
//     console.log(items);
//     for (item of items) {
//       if (item.isFile()) {
//         fs.copyFile(
//           path.resolve(way, item.name),
//           path.resolve(copyWay, item.name),
//           (err) => {
//             if (err) return console.error(err);
//           }
//         );
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
// copyFiles();

const fs = require("fs");
const path = require("path");
const way = path.resolve(__dirname, "files");
const copyWay = path.resolve(__dirname, "files-copy");
const fsPromises = fs.promises;

const getFiles = async (dirName) => {
  const dirents = await fsPromises.readdir(dirName, {withFileTypes: true});

  const files = await Promise.all(
    dirents.map((dirent) => {
      if (dirent.isDirectory()) {
        const entireFolderPath = path.resolve(dirName, dirent.name);

        return getFiles(entireFolderPath);
      }

      return dirent;
    })
  );

  return Array.prototype.concat(...files);
};

const checkAccessFile = async (checkedFilePath, checkedType) => {
  const isFolder = checkedType === "folder";

  try {
    //Если есть такая папка - берем ее содержимое и открепляем
    await fsPromises.access(
      checkedFilePath,
      fs.constants.R_OK | fs.constants.W_OK
    );

    if (isFolder) {
      const dirents = await getFiles(checkedFilePath);

      await Promise.all(
        dirents.map((dirent) => {
          fsPromises.unlink(path.resolve(checkedFilePath, dirent.name));
        })
      );
    }
  } catch (error) {
    //Если такой папки нет - создаем
    if (isFolder) {
      await fsPromises.mkdir(checkedFilePath, {recursive: true});
    }
  }

  return checkedFilePath;
};

const readFile = async (dirName) => {
  const readDir = await fsPromises.readdir(dirName, {withFileTypes: true});
  console.log(readDir);
  for (item of readDir) {
    if (item.isDirectory()) {
      const filesWithin = path.resolve(dirName, item.name);
      return readFile(filesWithin);
    } else {
      fsPromises.copyFile(
        path.resolve(dirName, item.name),
        path.resolve(copyWay, item.name)
      );
    }
  }
};

checkAccessFile(path.resolve(copyWay), "folder")
  .then(async (copyWay) => {
    const dirents = await fsPromises.readdir(way, {
      withFileTypes: true,
    });
    
    await Promise.all(
      dirents.map((dirent) => {
        if (dirent.isDirectory()) {
          const entireFolderPath = path.resolve(way, dirent.name);
          readFile(entireFolderPath);
        } else {
          fsPromises.copyFile(
            path.resolve(way, dirent.name),
            path.resolve(copyWay, dirent.name)
          );
        }
      })
    );

    console.log("Copy is done");
  })
  .catch((err) => console.error(err));
