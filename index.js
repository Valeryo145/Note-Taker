const express = require("express");
const path = require("path");
const fs = require("fs");
const ntData = require("./db/db.json");
const { v4: uuidv4 } = require("uuid");

//Creating an "express" server
const app = express();

//Sets an initial port
const PORT = process.env.PORT || 3000 ; 

app.use(express.static(path.join(__dirname, "./public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "./public/index.html")));
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "./public/notes.html")));
app.get("/api/notes", (req,res) => { res.json(ntData)});
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "./public/index.html")));

//add
app.post("/api/notes", (req, res) => {
  req.body.id = uuidv4();
  const newNote = req.body;

  ntData.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(ntData));
  res.json(ntData);
})
//delete

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));