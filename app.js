const express = require("express");
const app = express();

// use the express-static middleware
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.status(204);
});

const port = process.env.PORT || 8080;

// start the server listening for requests
app.listen(port, () => console.log(`Server runnning on ${port}`));
