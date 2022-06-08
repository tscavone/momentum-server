import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

// HERE trying to get environment vars to work to use them for login
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (
    username === process.env.USERNAME1 &&
    password === process.env.PASSWORD1
  ) {
    res.send({
      token: "abc123",
      userId: process.env.USERID1,
    });
  } else if (
    username === process.env.USERNAME2 &&
    password === process.env.PASSWORD2
  ) {
    res.send({
      token: "abc123",
      userId: process.env.USERID2,
    });
  } else {
    res.send(401);
  }
});

// app.get('/api/greeting', (req, res) => {
//     const name = req.query.name || 'World'
//     res.setHeader('Content-Type', 'application/json')
//     res.send(JSON.stringify({ greeting: `Hello ${name}!` }))
// })

const connectToDb = () => {
  const uri = process.env.DBCONN + process.env.DBSTR;
  const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
  });
  client.connect((err) => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
  });
  return Promise.resolve("db connected");
};

const port = 3001;

connectToDb()
  .then(() => {
    // start the Express server
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
