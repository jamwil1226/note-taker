var express = require("express");
var path = require("path");
var fs = require("fs");
var notes = require("./db/db.json")

var app = express();
var PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

currentID = notes.length;

// API Routes

app.get("/api/notes", (req, res) => {

    return res.json(notes);
});

app.post("/api/notes", (req, res) => {
    var newNote = req.body;

    newNote["id"] = currentID +1;
    currentID++;
    console.log(newNote);

    notes.push(newNote);

    rewriteNotes();

    return res.status(200).end();
});

app.delete("/api/notes/:id", (req, res) => {
    res.send('Got a DELETE request at /api/notes/:id')

    var id = req.params.id;

    var idLess = notes.filter(function (less) {
        return less.id < id;
    });

    var idGreater = notes.filter(function (greater) {
        return greater.id > id;
    });

    notes = idLess.concat(idGreater);

    rewriteNotes();
})


// HTML Routes

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Listen for PORT
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// Functions

function rewriteNotes() {
    fs.writeFile("db/db.json", JSON.stringify(notes), function (err) {
        if (err) {
            console.log("error")
            return console.log(err);
        }

        console.log("Success!");
    });
}