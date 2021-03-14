const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();

//GETTERS
app.set('port', process.env.PORT || 1000)

//MIDDELWARES
app.use(bodyParser.json());

//Mysql
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Toor',
    database: process.env.DB_DATABASE || 'nestcafe'
});

connection.connect( error => {
    if(error){throw error;}
    console.log('database running');
});

//all customers
app.get('/all', (req, res) => {
    const sql = 'SELECT * FROM productos';
    connection.query(sql, (err, result) => {
        if(err){throw err};
        if(result.length > 0){
            res.json(result);
        }else{
            res.send('not results');
        }
    })
});

app.get('/productos/:id', (req, res) => {
    const {id} = req.params;
    const sql = `SELECT * FROM productos WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
        if(err){throw err};
        if(result.length > 0){
            res.json(result);
        }else{
            res.send('not results');
        }
    })
});


app.post('/add', (req, res) => {
    const sql = `INSERT INTO productos SET ?`;
    const productos ={
        producto : req.body.producto,
        precio: req.body.precio
    }

    connection.query(sql, productos, err => {
        if(err){throw err};
        res.send('product preated')
    })
});

app.put('/update/:id', (req, res) => {
    const {id} = req.params;
    const {producto, precio} = req.body;
    const sql = `UPDATE productos SET producto='${producto}', precio=${precio} WHERE id=${id}`

    connection.query(sql, err => {
        if(err){throw err};
        res.send('product updated')
    })
});

app.delete('/delete/:id', (req, res) => {
    const {id} = req.params;
    const sql = `DELETE FROM productos WHERE id=${id}`;

    connection.query(sql, err => {
        if(err){throw err};
        res.send('product removed')
    })
});


//SERVER
app.listen(app.get('port'), ()=>{
    console.log(`server running in port ${app.get('port')}`)
})
