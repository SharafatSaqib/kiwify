const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const path = require("path");
const { dirname } = require("path");

app.use(bodyParser.json());

app.use(cors());

app.use(express(path.join(__dirname, "../client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kiwify",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

app.get("/video", (req, res) => {
  const SELECT_ALL_VIDEOS_QUERY = "SELECT * FROM video";
  connection.query(SELECT_ALL_VIDEOS_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results,
      });
    }
  });
});

// Create the API endpoint for getting a specific video by ID
app.get("/videos/:id", (req, res) => {
  connection.query(
    "SELECT * FROM videos WHERE id = ?",
    [req.params.id],
    (error, results, fields) => {
      if (error) throw error;
      res.send(results[0]);
    }
  );
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
