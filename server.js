const express = require('express');
const path = require('path');
const fs = require('fs');

//our database file
const db = require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 3000;

//allows express to parse json data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    return res.json(db);
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    
    //this will get the id of the last entry (which will be the highest) and increment it by one for a unique id,or will set it to 1 if there are no entries
    if(db.length > 0){
        newNote.id = db[db.length-1].id + 1;
    }else{
        newNote.id = 1;
    }

    db.push(newNote);
    res.json(db);
    fs.writeFile('./db/db.json', JSON.stringify(db), err => {
        if(err){
            throw err;
        }
        console.log(`A new note: "${newNote.title}" has been added to the list`);
    })
});

app.delete('/api/notes/:id', (req, res) => {
    let noteTitle;
    for(let i = 0; i < db.length; i++){
        const targetId = parseInt(req.params.id);
        if(db[i].id === targetId){
            noteTitle = db[i].title;
            db.splice(i, 1);
        };
    };
    res.json(db);
    fs.writeFile('./db/db.json', JSON.stringify(db), err => {
        if(err) {
            throw err;
        }
        console.log(`Note titled: "${noteTitle}" has been deleted`);
    });
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});