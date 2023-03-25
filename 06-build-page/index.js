const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;
const projectWay = path.resolve(__dirname, "project-dist");
const assetsWay = path.resolve(__dirname, "project-dist", "assets");
const htmlWay = path.resolve(projectWay, "index.html");
const cssWay = path.resolve(projectWay, "style.css");
const assetsFolder = path.resolve(__dirname, "assets");
const cssFolder = path.resolve(__dirname, "styles");
const htmlContent = path.resolve(__dirname, "components");
const htmlTemplate = path.resolve(__dirname, "template.html");

fs.mkdir(projectWay, {recursive: true}, (err) => {
  if (err) return console.error(error);
});

fs.mkdir(assetsWay, {recursive: true}, (err) => {
  if (err) return console.error(error);
});

fs.writeFile(htmlWay, "", (err) => {
  if (err) return console.error(error);
});

fs.writeFile(cssWay, "", (err) => {
  if (err) return console.error(error);
});

const getAssets = async () => {
  try {
    const dirents = await fsPromises.readdir(assetsFolder, {
      withFileTypes: true,
    });
    for (dirent of dirents) {
      let copies = await fsPromises.readdir(
          path.resolve(assetsFolder, `${dirent.name}`),
          {withFileTypes: true}
        );
        fs.mkdir(
          path.resolve(assetsWay, `${dirent.name}`),
          {recursive: true},
          (err) => {
            if (err) return console.error(error);
          }
        );
      
      let readyCopy = await fsPromises.readdir(
        path.resolve(assetsWay, `${dirent.name}`),
        {withFileTypes: true}
      );

      for (item of readyCopy) {
        fs.unlink(
          path.resolve(assetsWay, `${dirent.name}`, `${item.name}`),
          (err) => {
            if (err) return console.error(error);
          }
        );
      }
      for (copy of copies) {
        fs.copyFile(
          path.resolve(assetsFolder, `${dirent.name}`, `${copy.name}`),
          path.resolve(assetsWay, `${dirent.name}`, `${copy.name}`),
          (err) => {
            if (err) return console.error(error);
          }
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};
getAssets();

const getHtml = async () => {
  try {
    let template = await fsPromises.readFile(htmlTemplate, "utf-8");
    const components = await fsPromises.readdir(htmlContent, {
      withFileTypes: true,
    });
    for (component of components) {
      if (component.isFile() && path.extname(component.name) === ".html") {
        let acc = await fsPromises.readFile(
          path.resolve(htmlContent, `${component.name}`),
          "utf-8"
        );
        // console.log(acc);
        template = template.replace(`{{${component.name.slice(0, -5)}}}`, acc);
      }
    }
    fsPromises.writeFile(path.resolve(htmlWay), template);
  } catch (error) {
    console.error(error);
  }
};
getHtml();

const getStyles = async () => {
  try {
    const dirents = await fsPromises.readdir(cssFolder, {withFileTypes: true});

    for (i = 0; i < dirents.length; i++) {
      // console.log(dirents[i].name);
      if (
        dirents[i].isFile() &&
        path.extname(dirents[i].name).slice(1) === "css"
      ) {
        //   console.log(`есть совпандение ${dirents[i].name}!`);
        fs.readFile(
          path.resolve(cssFolder, dirents[i].name),
          "utf-8",
          (err, data) => {
            if (err) return console.error(err);

            fs.appendFile(path.resolve(cssWay), data, (err) => {
              if (err) throw err;
            });
          }
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};
getStyles();
