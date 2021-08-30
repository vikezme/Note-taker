const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');

app.use(express.json());

app.use( express.static('public'))

app.get('/', (req, res) => {
    res.sendFile('./public/index.html', { root: __dirname });
});

app.get('/notes', (req, res) => {
    res.sendFile('./public/notes.html', { root: __dirname });
});


app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, json) => {
        let obj = JSON.parse(json);
        res.json(obj);
    });
});


app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, json) => {
        let obj = JSON.parse(json);
        let newNote = req.body;
        newNote.id = uuidv4();

        obj.push(newNote);

        fs.writeFileSync('./db/db.json', JSON.stringify(obj));
        res.json(newNote);
    });
});


app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', (err, json) => {
        let obj = JSON.parse(json);
        let deleteId = req.params['id'];

        obj = obj.filter(item => item.id != deleteId);

        fs.writeFileSync('./db/db.json', JSON.stringify(obj));
        res.status(200).json({status:"ok"});
    });
});

app.listen(port, () => console.log(`Listening on PORT: ${port}`));
