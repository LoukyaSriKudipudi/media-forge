const app = require("./app");
const chalk = require("chalk");
require("./utilis/cleaner");

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    chalk.green.bgWhiteBright.bold(
      `-----------------------------------\n--- App is running on port ${port} ---\n-----------------------------------`
    )
  );
});
