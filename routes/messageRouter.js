const connect = require("../dbConfig");
const Message = require("../models/Message");

const router = require("express").Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // const result = await Message.findOne({to:id}, [], { sort: { updatedAt: -1 } });
    // res.status(201).json(result);
    // ORDER BY updatedAt DESC
    const query = `SELECT * FROM message WHERE \`to\`=${id}`;
    connect.query(query, function (err, rows, fields) {
      if (err) throw err;
      console.log("rows", rows);
      res.status(200).json(rows[0]);
    });
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // const result = await Message.findByIdAndDelete(id);
    // res.status(201).json(result);
    const query = "DELETE FROM `message` WHERE _id="+id;
    connect.query(query, function (err, rows, fields) {
      if (err) throw err;
      console.log("rows", rows);
      res.status(200).json(rows);
    });
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

module.exports = router;
