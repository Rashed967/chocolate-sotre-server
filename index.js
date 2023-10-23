const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const {DB_NAME, DB_PASS} = process.env;

// middleware 
app.use(cors())
app.use(express.json())


// connect to database and read write

const uri = `mongodb+srv://${DB_NAME}:${DB_PASS}@cluster0.kt6fwyn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// create database 
const database = client.db('chocolateShop');
const chocolateCollection = database.collection('chocolates')


// database operation 

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // get all chocolaes 
    app.get('/chocolates', async (req, res) => {
        const cursor = chocolateCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    // get specific chocolate 
    app.get('/chocolates/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await chocolateCollection.findOne(query)
        res.send(result)
    })

    // create a chocolate 
    app.post('/chocolates', async (req, res) => {
        const chocolate = req.body;
        const result = await chocolateCollection.insertOne(chocolate)
        res.send(result)
    })

    // update chocolate info 
    app.put('/chocolates/:id', async(req, res) => {
        const id = req.params.id;
        const { name, category, photourl, country} = req.body;
        const filter = {_id : new ObjectId(id)}
        console.log(filter)
        const options = {upsert : true}
        const updateDoc = {
            $set : {
                name,
                category, 
                photourl, 
                country
            }
        }
        const result = await chocolateCollection.updateOne(filter, updateDoc, options)
       res.send(result) 

    })

    // delete chocolate 
    app.delete('/chocolates/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await chocolateCollection.deleteOne(query)
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




// root route 
app.get('/', (req, res) => {
    res.send("server is running")
})

// app listent 
app.listen(port, () => {
    console.log("serve is running on port", port)
})
