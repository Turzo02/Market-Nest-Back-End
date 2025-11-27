const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config()


const uri = `mongodb+srv://${process.env.MN_USER}:${process.env.MN_PASS}@smartproduct.gqn7fwo.mongodb.net/?appName=SmartProducT`;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World! Server is running!')
})



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
   const productCollection = client.db('MarketNest').collection('products')


   //all products
   app.get('/products', async(req, res) => {
    const cursor = productCollection.find()
    const result = await cursor.toArray()
    res.send(result)
   })
   //Get Single Product by id
   app.get('/products/:id', async(req, res) => {
    const id = req.params.id
    const query = { _id: new ObjectId(id) }
    const result = await productCollection.findOne(query)
    res.send(result)
   })

   //Get Product by Email
   app.get('/products/email/:email', async(req, res) => {
    const email = req.params.email
    const query = { submitted_by_email: email }
    const result = await productCollection.find(query).toArray()
    res.send(result)
   })

   //Product Delete
   app.delete('/products/:id', async(req, res) => {
    const id = req.params.id
    const query = { _id: new ObjectId(id) }
    const result = await productCollection.deleteOne(query)
    res.send(result)
   })
   
   // add product
   app.post('/products', async(req, res) => {
    const product = req.body
    const result = await productCollection.insertOne(product)
    res.send(result)
   })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
