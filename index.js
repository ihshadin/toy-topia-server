const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middle ware 
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('ToyTopia is running...')
})

app.listen(port, (req, res) => {
    console.log('ToyTopia is running on: ', port);
})