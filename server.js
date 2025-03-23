const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
const port = 9000;

require('dotenv').config()
app.use(cors())
app.use(bodyParser.json())

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    // console.log('reaches here')
    const sql = "INSERT INTO authentication (username, password) VALUES (?,?)"
    
    db.query(sql, [username, password], (err)=>{
        if(err){
            return res.status(500).send(err)
        }
        res.send("User registered successfully.")
    })
})

app.post('/login', (req, res)=>{
    const {username, password} = req.body;
    const sql = "SELECT * FROM authentication WHERE username = ?"

    db.query(sql, [username], async (err, results)=>{
        if (err){
            console.log(err.message)
            return res.status(500).send(err)
        }
        
        if(results.length === 0){
            return res.status(400).send("Invalid username!")
        }
        
        const match = (password === results[0].password)

        if(!match){
            return res.status(401).send("Invalid password");
        }

        const token = jwt.sign({id: results[0].id }, 'secret_key', { expiresIn: '1h'})
        res.json({token})
    })
})

app.listen(port, () =>{
    console.log('Server running on port 9000')
})