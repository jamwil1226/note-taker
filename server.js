const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Get/notes - needs to return notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
    console.log("Your Notes!");
})

// Get * - needs to return index.html (?)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
    console.log("Your index!");
})

app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "db", "db.json"), 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        console.log('File data:', jsonString)
        res.json(JSON.parse(jsonString));
    })
})


app.post("/api/notes", function (req, res) {

    fs.readFile(path.join(__dirname, "db", "db.json"), 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        console.log('File data:', jsonString);
        // json.parse
        var notes = JSON.parse(jsonString);

        // Note object 
        const newNote = {
            title: req.body.title,
            text: req.body.text,
            // id
            id: Math.random().toString(36).substr(2, 9)
        };

        
        // let noteText = [];
        notes.push(newNote);
        // Will not push to newNote
        let NotesJSON = JSON.stringify(notes);
        // push to array 
        // then stringify 

        fs.writeFile(path.join(__dirname, "db", "db.json"), NotesJSON, (err) => {
            if (err) {
                return console.log(err);
            }
            // this is console logging
            console.log("Success!", NotesJSON);
            return NotesJSON;
        });

    })

});


app.delete('/api/notes/:id', function (request, response) {

    fs.readFile(path.join(__dirname, "db", "db.json"), 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        console.log('File data:', jsonString);
        // json.parse
        var notes = JSON.parse(jsonString);

        // Note object 
        const newNote = {
            title: req.body.title,
            text: req.body.text,
            // Github code 
            id: Math.random().toString(36).substr(2, 9)
        };

        notes.splice(request.params.id, 1);
        let NotesJSON = JSON.stringify(notes);

        fs.writeFile(path.join(__dirname, "db", "db.json"), NotesJSON, (err) => {
            if (err) {
                return console.log(err);
            }
            // this is console logging
            console.log("Success!", NotesJSON);
            return NotesJSON;
        });

    })

});


// Server listening confirmation
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});