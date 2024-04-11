const express = require("express");
const path = require("path");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
app.use(
  cors({
    origin:
      "http://lesson-shop-env.eba-a9ygfdpz.us-east-1.elasticbeanstalk.com/",
  })
);
("mongodb+srv://abidmiah015:PiKkchwwKKMF2HM5@cluster0.3egxd6z.mongodb.net/?retryWrites=true&w=majority");
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let database;

app.use(express.static(path.join(__dirname, "..", "/front-end")));
app.use(express.json());
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    database = client.db("shopping");
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.get("/api/lessons", async (req, res) => {
      console.log("API route accessed!");
      try {
        const array = await database.collection("lesson").find({}).toArray();

        res.json(array);
      } catch (error) {
        console.error("Error fetching lessons:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.post("/api/orders", async (req, res) => {
      try {
        const { name, number, lessons, lessonData } = req.body;
        console.log("Request Body:", req.body);

        await database.collection("order").insertOne({
          name: name,
          number: number,
          lessons: lessons,
          timestamp: new Date(),
        });

        res.json({ success: true, message: "Order submitted successfully" });
      } catch (error) {
        console.error("Error submitting order:", error);
        res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      }
    });

    app.put("/api/lessons/:id", async (req, res) => {
      const lessonId = req.params.id;
      const updateData = req.body;

      try {
        await database
          .collection("lesson")
          .updateOne({ _id: new ObjectId(lessonId) }, { $set: updateData });

        res.json({ success: true, message: "Lesson updated successfully" });
      } catch (error) {
        console.error("Error updating lesson:", error);
        res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      }
    });

    app.use((req, res) => {
      res.status(404);
      res.send("<h1>Error 404: Resource not found</h1>");
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log("App listening on port " + port);
    });
  } finally {
  }
}

run().catch(console.dir);
