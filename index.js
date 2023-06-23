const cors = require('cors');
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const app = express();
app.use(express.json()); 
app.use(cors());
const env=require('dotenv').config();
const connect = require('./db/connect');


const userSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  gender: String,
  status: String,
  createdAt: Date,
  updatedAt: Date,
});
const User = mongoose.model('Gold_Stone_User', userSchema);


app.get('/export-csv', async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      res.status(400).send('No user data found.');
      return;
    }

    const csvWriter = createCsvWriter({
      path: 'users.csv',
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'gender', title: 'Gender' },
        { id: 'status', title: 'Status' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'updatedAt', title: 'Updated At' },
      ],
    });

    await csvWriter.writeRecords(users);
    res.download('users.csv');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while exporting user data to CSV.');
  }
});

app.get('/', (req, res) => {
    res.send('Hello! Welcome to MicroService3 - where you can download all users data in the form of CSV file');
}); 
const port = process.env.PORT;
connect()
.then(() => {
    app.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
    })
})
.catch((err) => {
    console.log('Server failed')
})