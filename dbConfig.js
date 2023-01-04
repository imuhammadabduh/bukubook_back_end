const mysql = require("mysql2");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config()

// Create the connection pool. The pool-specific settings are the defaults
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "db_angkringan_2100016008",
//   //   password:"MuhammadAbduh23092002",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// const connect = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "bukubook",
// });
// console.log("connect");


// Create Database Connection
const connect = () => {
  // MySql Connection
  if (process.env.DB_CONN == "MySql") {
    console.log("connected to MySql")
    return mysql.createConnection({
      host: process.env.DB_HOST ?? "localhost",
      user: process.env.DB_USER ?? "root",
      password: process.env.DB_PASS ?? "",
      database: process.env.DB_NAME ?? "bukubook",
    })
  }

  // Mongo Connection
  if (process.env.DB_CONN == "Mongo") {
   mongoose.set("strictQuery", false);

   const mongoUri = `mongodb://${process.env.DB_NAME}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}`;

   mongoose.connect(
     "mongodb://bukubook:bukubook@ac-nqma1ng-shard-00-00.q69pqbn.mongodb.net:27017,ac-nqma1ng-shard-00-01.q69pqbn.mongodb.net:27017,ac-nqma1ng-shard-00-02.q69pqbn.mongodb.net:27017/?ssl=true&replicaSet=atlas-og9t91-shard-0&authSource=admin&retryWrites=true&w=majority",
     (conn) => {
       console.log("connected to mongodb");
     },
     (err) => {
       console.error("Connection to mongodb errors!", err.message);
     }
   );

   return mongoose; 
  }
}

module.exports = connect;