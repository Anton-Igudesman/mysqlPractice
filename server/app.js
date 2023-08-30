const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { PORT } = process.env;

const dbService = require('./dbService.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false})); //not sending any form data

//create
app.post('/insert', (req, res) => {
    const { name } = req.body;
    console.log(name)
    const db = dbService.getDbServiceInstance();
    console.log(db)
    const result = db.insertNewName(name)

    result
        .then(data => res.json({data}))
        .catch(err => console.log(err));
    
});

//read
app.get('/getAll', (req, res) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllData();
    result
        .then(data => res.json({ data : data }))
        .catch (err => console.log(err));
});



//update
app.patch('/update', (req, res) => {
    const { id, name } = req.body;
    
    console.log(req.body);
    
    const db = dbService.getDbServiceInstance();
    const result = db.updateNameById(id, name);

    result
        .then(data => res.json({}))
        .catch(err => console.log(err));
});

//delete
app.delete('/delete/:id', (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id);

    result  
        .then(data => res.json({ success: data }))
        .catch(err => console.log(err));
});

app.get('/search/:name', (req, res) => {
    const { name } = req.params;
    console.log(name);
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName(name);

    result
        .then(data => res.json({data:data}))
        .catch(err => console.log(err));
})



app.listen(PORT, () => console.log(`Listening on Port: ${PORT}`));