const router = require("express").Router();
const connect = require("../dbConfig")();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// creating user
router.post("/", async (req, res) => {
  let msg;
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    // const user = await User.create({ name, email, password });
    // res.status(201).json(user);
    if (name === "" || email === "" || password === "") {
      msg = "Masukan semua kolom!";
      return res.status(400).json(msg);
    }

    const query1 = `SELECT * FROM user WHERE email='${email}'`;
    connect.query(query1, function (err, rows, fields) {
      if (err) throw err;
      console.log("q1", rows);
      if (rows[0]) {
        msg = "Pengguna Sudah Terdaftar";
        return res.status(400).json(msg);
      }

      bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(password, salt, function (err, hashPassword) {
          if (err) return next(err);

          const query2 = `INSERT INTO user(name, email, password) VALUES('${name}','${email}','${hashPassword}')`;
          connect.query(query2, function (err, rows, fields) {
            if (err) throw err;

            console.log("rows", rows);
            res.status(200).json(rows);
          });
        });
      });
    });
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

// login user

router.post("/login", async (req, res) => {
  let msg;

  try {
    const { email, password } = req.body;
    // const user = await User.findByCredentials(email, password);
    // user.status = "online";
    // await user.save();
    // res.status(200).json(user);
    if (email === "" || password === "") {
      msg = "Masukkan semua kolom!";
      return res.status(400).json(msg);
    }
    const query1 = `SELECT * FROM user WHERE email='${email}'`;
    connect.query(query1, async function (err, rows, fields) {
      if (err) throw err;
      console.log("q1", rows);
      if (!rows[0]) {
        msg = "Pengguna Tidak Terdaftar";
        return res.status(400).json(msg);
      }

      const isMatch = await bcrypt.compare(password, rows[0].password);
      if (!isMatch) {
        msg = "Password anda tidak valid!";
        return res.status(400).json(msg);
      }
      res.status(200).json(rows[0]);
    });
  } catch (e) {
    res.status(400).json(e.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const resultUser = await User.findById(id);
    // res.status(200).json(resultUser);

    const query1 = `SELECT * FROM user WHERE _id='${id}'`;
    connect.query(query1, async function (err, rows, fields) {
      if (err) throw err;
      console.log("q1", rows);
      res.status(200).json(rows[0]);
    });
  } catch (e) {
    res.status(400).json(e.message);
  }
});

module.exports = router;
