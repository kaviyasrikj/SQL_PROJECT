const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employees'
});

db.connect(err => {
    if(err) {
        console.error('Error connecting to MySQL database:', err);
    }else{
        console.log('Connected to the MySql database');
    }
});

app.post('/employees', (req, res) => {
    const { name, position, salary } = req.body;
    const sqlInsert = 'INSERT INTO employees (name, position, salary) VALUES(?, ?, ?)';
    db.query(sqlInsert, [name, position, salary], (err, result) => {
        if(err) {
            res.status(500).send({ error: err.message});
        }else{
            res.status(201).send({message: 'Employees added successfully'});
        }
    });
});
app.get('/employees',(req,res) => {
    const page = parseInt(req.query.page)||1;
    const limit = parseInt(req.query.limit)||10;
    const offset = (page - 1)*limit;

    const sqlQuery = `SELECT * FROM employees LIMIT ${limit} OFFSET ${offset}`;
    db.query(sqlQuery, (err, result) =>{
        if(err){
            res.status(500).send({error:err.message});
        }else{
            res.send(result);
        }
    });
});

app.listen(5000,()=>{
    console.log('Server running on port 5000');
});