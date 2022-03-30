const express = require("express");
const cluster = require("cluster");
const os = require("os");

const app = express();

const numCpus = os.cpus().length;

app.get("/", (req, res) => {
  for (let i = 0; i < 1e8; i++) {
    //heavy task
  }
  res.send(`${process.pid} is Serving `);
});

if (cluster.isMaster) {
  for (let i = 0; i < numCpus; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    cluster.fork();
  });
} else {
  app.listen(4000, (err, done) => {
    if (err) return console.log("Error is", err);
    console.log("listening to server", process.pid);
  });
}
