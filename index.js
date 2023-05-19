const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middle ware 
app.use(cors());
app.use(express.json())

console.log(process.env.USER_NAME);

const uri = `mongodb+srv://${process.env.USER_NAME}:zEiyMkuVQ5tKpp5e@cluster0.03baylt.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const toysCollection = client.db('toysDB').collection('toys');

        // Add new toy
        app.post('/add-toy', async (req, res) => {
            const newToy = req.body;
            const result = await toysCollection.insertOne(newToy);
            res.send(result);
        })



        // await client.db("admin").command({ ping: 1 });
        console.log("Your server successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('ToyTopia is running...')
})

app.listen(port, (req, res) => {
    console.log('ToyTopia is running on: ', port);
})