const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middle ware 
app.use(cors());
app.use(express.json())


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

        // for search create index
        const indexKeys = { toyName: 1 };
        const indexOptions = { name: "toyName" };
        const result = await toysCollection.createIndex(indexKeys, indexOptions);

        // All toys
        app.get('/all-toys', async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit
            const result = await toysCollection.find().skip(skip).limit(limit).toArray();
            res.send(result);
        })
        // Total Toys for pagination
        app.get('/totalToys', async (req, res) => {
            const result = await toysCollection.estimatedDocumentCount();
            res.send({ totalToys: result });
        })
        // Search query
        app.get('/search/:toyName', async (req, res) => {
            const searchText = req.params.toyName;
            const result = await toysCollection.find({
                toyName: { $regex: searchText, $options: "i" }
            }).toArray();
            res.send(result);
        })
        // Toys filter by categories
        app.get('/all-toys/:category', async (req, res) => {
            const category = req.params.category;
            const filter = { toyCategory: category };
            const result = await toysCollection.find(filter).toArray();
            res.send(result);
        })
        // toys show based on user
        app.get('/my-toys/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { sellerEmail: email };
            const result = await toysCollection.find(filter).toArray();
            res.send(result);
        })
        // Add new toy
        app.post('/add-toy', async (req, res) => {
            const newToy = req.body;
            const result = await toysCollection.insertOne(newToy);
            res.send(result);
        })
        // update signle toy get
        app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await toysCollection.findOne(filter);
            res.send(result);
        })
        // Update toys
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedToy = req.body;
            console.log(updatedToy);
            const updated = {
                $set: {
                    toyName: updatedToy.toyName,
                    toyPhoto: updatedToy.toyPhoto,
                    toyPrice: updatedToy.toyPrice,
                    toyQuantity: updatedToy.toyQuantity,
                    toyRating: updatedToy.toyRating,
                    toyCategory: updatedToy.toyCategory,
                    toyDesc: updatedToy.toyDesc,
                }
            }
            const result = await toysCollection.updateOne(query, updated);
            res.send(result);
        })
        // Delete toy
        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.deleteOne(query);
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