const { sequelize } = require("./config/database");
const app = require("./app");
const { generateHash } = require("./utils/auth");

sequelize
  .sync()
  .then(() => {
    app.listen(3333, () => console.log("Listening on http://localhost:3333"));
  })
  .catch((err) =>
    console.error("Sequelize synchronization failed with error: ", err)
  );
