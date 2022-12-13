const express = require("express");
const path = require("path");
const fs = require("fs");
const ntData = require("./db/db.json");
//npm pack
const { v4: uuidv4 } = require("uuid");

//Creating an "express" server
const app = express();
//Sets an initial port
const PORT = process.env.PORT || 8000 ; 


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
app.delete("/api/notes/:id", function (req, res) {
  let jsonFilePath = path.join(__dirname, "/db/db.json");
  // request to delete note by id.
  for (let i = 0; i < ntData.length; i++) {

      if (ntData[i].id == req.params.id) {
          // Splice takes i position, and then deletes the 1 note.
          ntData.splice(i, 1);
          return;
      }
  }
  // Write the db.json file again.
  fs.writeFileSync(jsonFilePath, JSON.stringify(ntData), function (err) {

      if (err) {
          return console.log(err);
      } else {
          console.log("Your note was deleted!");
      }
  });
  res.json(ntData);
});


app.listen(PORT, () => 
 console.log(`App listening on PORT ${PORT}`));