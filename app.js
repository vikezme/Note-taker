const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');

app.use(express.json());

app.use('/assets', express.static('public/assets'))

app.get('/', (req, res) => {
    res.sendFile('./public/index.html', { root: __dirname });
});

app.get('/notes', (req, res) => {
    res.sendFile('./public/notes.html', { root: __dirname });
});

//* `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, json) => {
        let obj = JSON.parse(json);
        res.json(obj);
    });
});

//* `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file
// and then return the new note to the client.
// You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
// {title: "dfg", text: "dfg"}
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, json) => {
        let obj = JSON.parse(json);
        let newNote = req.body;
        newNote.id = uuidv4();
        //console.log(newNote);
        //console.log(obj);
        // Add the new note
        obj.push(newNote);
        //console.log(obj);
        // Write back to file
        fs.writeFileSync('./db/db.json', JSON.stringify(obj));
        res.json(newNote);
    });
});

//* `DELETE /api/notes/:id` should receive a query parameter that contains the id of a note to delete.
// To delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', (err, json) => {
        let obj = JSON.parse(json);
        let deleteId = req.params['id'];
        // Delete the note
        obj = obj.filter(item => item.id != deleteId);
        //console.log(obj);
        // Write back to file
        fs.writeFileSync('./db/db.json', JSON.stringify(obj));
        res.status(200).json({status:"ok"});
    });
});

app.listen(port, () => {
})
