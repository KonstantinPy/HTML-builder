const path = require("path");
const fs = require("fs");
const way = path.join(__dirname, "secret-folder");

fs.readdir(way, {withFileTypes: true}, (err, data) => {
  if (err) throw err;
  for (let i = 0; i < data.length; i++) {
    if (data[i].isFile() === true) {
      fs.stat(path.resolve(way, `${data[i].name}`), (error, stats) => {
        if (err) throw err;
        console.log(
          `${data[i].name.split(".").slice(0, -1)} - ${path
            .extname(data[i].name)
            .slice(1)} - ${stats.size / 1000}kb`
        );
      });
    }
  }
});
