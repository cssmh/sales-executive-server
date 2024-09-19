const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://saleproducts-aff1e.web.app",
      "https://sellproduct.netlify.app",
    ],
  })
);
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // client.connect();
    const OrderCollection = client.db("OrderManagement").collection("Orders");

    app.get("/all-order", async (req, res) => {
      try {
        const result = await OrderCollection.find().toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    app.get("/order/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await OrderCollection.findOne(query);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    app.get("/my-orders", async (req, res) => {
      try {
        const email = req.query.email;
        let query = {};
        if (email) {
          query = { seller: email };
        }
        const result = await OrderCollection.find(query).toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    app.post("/add-order", async (req, res) => {
      try {
        const result = await OrderCollection.insertOne(req.body);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    app.delete("/order/:id", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params?.id) };
        const result = await OrderCollection.deleteOne(query);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Sales Executive server");
});

app.listen(port, () => {
  console.log(`CRUD IS RUNNING ON PORT ${port}`);
});
