const express = require("express");
const cors = require("cors");
// require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://portfolio:t9bweCB1l0hNwBxI@cluster0.ehqhw1m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Connect to the MongoDB client only once
    await client.connect();

    const AchievementCollection = client.db('Portfolio').collection('acivements');

    
    app.get('/achieve', async(req, res) => {
      const result = await AchievementCollection.find().toArray();
      res.send(result);
    });

    app.post('/achieve', async(req, res) => {
      const achieve = req.body;
      const result = await AchievementCollection.insertOne(achieve);
      res.send(result);
    });

    app.get('/achieve/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await AchievementCollection.findOne(query);
      res.send(result);
    })


  //   app.put('/achieveE/:id', async (req, res) => {
  //     const { id } = req.params; // URL থেকে id সংগ্রহ করুন
  
  //     // id কে ObjectId ফরম্যাটে রূপান্তর করুন
  //     const filter = { _id: new ObjectId(id) };
  //     const options = {upsert: true};
  //     const achieve = req.body;
  //     const updateDoc = { 
  //         $set: {
  //             title: achieve.title,
  //             description: achieve.description,
  //             date: achieve.date,
  //             url: achieve.url,
  //         }
  //     };
  //     const result = await AchievementCollection.updateOne(filter, updateDoc, options);
  //     res.send(result);
  // });

  app.put('/achieve/:id', async (req, res) => {
    const { id } = req.params; // এখানে URL থেকে id সংগ্রহ করুন
    const achieve = req.body;

    // এখানে ObjectId ব্যবহার করে আইডি রূপান্তর করা হয়েছে
    const filter = { _id: new ObjectId(id) };
    const updateDoc = { 
        $set: {
            title: achieve.title,
            description: achieve.description,
            date: achieve.date,
            url: achieve.url,
        }
    };

    try {
        const result = await AchievementCollection.updateOne(filter, updateDoc);
        res.send(result);
    } catch (err) {
        console.error('Error updating document:', err);
        res.status(500).send({ error: 'Failed to update achievement' });
    }
});



    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Hello from the Express server!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
