const express = require('express');
const connectDB = require('./config/db')
const { resolve } = require('path');
const User = require('./schema')
require('dotenv').config()
const app = express();
app.use(express.json())


const port = 3010;

app.use(express.static('static'));

app.post("/api/users", async (req, res) => {
  try {
    const {name, email, password, createdAt} = req.body
    
    if (name == null || email == null || password == null) {
      return res.status(405).send("Provide required fields!")
    }

    const existingUser = await User.findOne({email})

    if (existingUser) {
      return res.status(400).send("User already exists")
    }

    const newUser = new User({
      name,
      email,
      password,
      createdAt
    })

    await newUser.save()
    return res.status(201).send(newUser)



    
  } catch (err) {
    return res.status(500).send(err.message)
  }
})

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  try {
    connectDB()
    console.log(`Example app listening at http://localhost:${port}`);
  } catch (err) {
    console.error(err.message)
  }
  
});
