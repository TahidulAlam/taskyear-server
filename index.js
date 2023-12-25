const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
// tahidcse
// 9IWQ1OWv9QnAVvqk
// const corsOptions = {
//   origin: [
//     "http://localhost:5173",
//     "http://localhost:5174",
//     "https://taskyear.web.app",
//   ],
//   credentials: true,
//   optionSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w9927an.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const taskyearDB = client.db("taskyearDB");
    const taskCollection = taskyearDB.collection("taskCollection");

    app.get("/api/addTask", async (req, res) => {
      try {
        let query = {};
        if (req.query?.email) {
          query = { email: req.query.email };
        }
        const result = await taskCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.post("/api/addTask", async (req, res) => {
      try {
        const data = req.body;
        const result = await taskCollection.insertOne(data);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });
    app.delete("/api/addTask/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });
    app.patch("/api/addTask/:id", async (req, res) => {
      try {
        const defaultData = req.body;
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            category: defaultData.category,
            deadline: defaultData.deadline,
            shortDetails: defaultData.shortDetails,
            taskTitle: defaultData.taskTitle,
          },
        };
        const result = await taskCollection.updateOne(filter, updatedDoc);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });
    app.put("/api/addTask/:taskId", async (req, res) => {
      try {
        const taskId = req.params.taskId;
        const updatedData = req.body;

        const filter = { _id: new ObjectId(taskId) };
        const update = { $set: updatedData };

        const result = await taskCollection.updateOne(filter, update);

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating task" });
      }
    });
    console.log(
      "Taskyear Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello from taskyear Server..");
});

app.listen(port, () => {
  console.log(`taskyear is running on port ${port}`);
});
