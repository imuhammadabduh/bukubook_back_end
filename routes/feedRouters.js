const connect = require("../dbConfig")();
const Feed = require("../models/Feeds");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    // const result = await Feed.find({}, [], { sort: { updatedAt: -1 } });
    const query = "SELECT * FROM `feed` ORDER BY updatedAt DESC";
    connect.query(query, function (err, rows, fields) {
      if (err) throw err;
      console.log("rows", rows, "fields", fields);
      res.status(200).json(rows);
    });
  } catch (e) {
    console.log(e);
    res.status(400).json(e.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const result = await Feed.find({ user_id: id }, [], {
    //   sort: { updatedAt: -1 },
    // });
    // res.status(201).json(result);
    const query = "SELECT * FROM `feed` where user_id=" + id;
    connect.query(query, function (err, rows, fields) {
      if (err) throw err;
      console.log("rows", rows, "fields", fields);
      res.status(200).json(rows);
    });
  } catch (e) {
    console.log(e);
    res.status(400).json(e.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { user_nama, user_id, user_content } = req.body;
    // const result = await Feed.create({ user_nama, user_id, user_content });
    // res.status(200).json(result);
    const query = `INSERT INTO feed(user_nama, user_id, user_content) VALUES('${user_nama}','${user_id}','${user_content}')`;
    connect.query(query, function (err, rows, fields) {
      if (err) throw err;
      console.log("rows", rows, "fields", fields);
      res.status(200).json(rows);
    });
  } catch (e) {
    console.log(e);
    res.status(400).json(e.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const result = await Feed.findOneAndDelete({ _id: id });
    // res.status(200).json(result);
    const query = "DELETE FROM `feed` WHERE _id=" + id;
    connect.query(query, function (err, rows, fields) {
      if (err) throw err;
      console.log("rows", rows, "fields", fields);
      res.status(200).json(rows);
    });
  } catch (e) {
    console.log(e);
    res.status(400).json(e.message);
  }
});

module.exports = router;
